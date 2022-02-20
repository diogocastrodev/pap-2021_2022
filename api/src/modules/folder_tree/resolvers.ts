import { Resolvers, ReturnFolders } from "../../graphql/types";
import { ResolverContext } from "../../context";
import { AuthenticationError } from "apollo-server-errors";
import { db } from "../../database";
import { createDataTree, getDepth } from "./helpers";

export const FolderResolver: Resolvers<ResolverContext> = {
  Query: {
    userFolders: async (_parent, _args, context) => {
      if (!context.is_authed || typeof context.user_id === "undefined")
        throw new AuthenticationError("no login");

      const userFolders = await db.folders.findMany({
        where: {
          user_id: context.user_id.toString(),
        },
      });

      let userFolders_array: ReturnFolders = {
        folders: [],
        folders_amount: 0,
      };

      userFolders_array.folders = createDataTree(userFolders);
      userFolders_array.folders_amount = getDepth(userFolders_array.folders);

      return userFolders_array;
    },
  },
  Mutation: {
    createFolder: async (_parent, args, context) => {
      if (!context.is_authed || context.user_id === undefined)
        throw new AuthenticationError("no login");

      const folder = await db.folders.create({
        data: {
          user_id: context.user_id.toString(),
          name: args.data.name,
          parent_id: args.data.parent_id && args.data.parent_id.toString(),
          color: args.data.color ? args.data.color : "#AAA",
          color_style: args.data.color_style ? args.data.color_style : "HEX",
        },
      });

      if (folder) throw new Error("Failed creating folder");

      return folder;
    },
  },
};
