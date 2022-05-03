import { Resolvers, ReturnFolders } from "../../graphql/types";
import { ResolverContext } from "../../context";
import { AuthenticationError } from "apollo-server-errors";
import { db } from "../../database";
import { createDataTree, getDepth } from "./helpers";
import { files, folders } from "@prisma/client";
import { getUserByPublicId } from "../user/helpers";

export const FolderResolver: Resolvers<ResolverContext> = {
  Query: {
    userFolders: async (_parent, _args, context) => {
      if (!context.is_authed || typeof context.user_id === "undefined")
        throw new AuthenticationError("no login");

      const userFolders: (folders & {
        files: files[];
      })[] = await db.folders.findMany({
        where: {
          user: {
            public_user_id: context.user_id.toString(),
          },
        },
        orderBy: {
          name: "asc",
        },
        include: {
          files: true,
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
    getFilesByFolder: async (_parent, args, context) => {
      if (!context.is_authed || typeof context.user_id === "undefined")
        throw new AuthenticationError("no login");

      try {
        const folder = await db.folders.findUnique({
          where: {
            folder_id: args.folderId,
          },
          select: {
            user: {
              select: {
                public_user_id: true,
              },
            },
          },
        });

        if (!folder) throw new Error("folder not found");

        if (
          folder.user.public_user_id.toString() !== context.user_id.toString()
        )
          throw new AuthenticationError("no access");
      } catch (err) {
        throw new Error(err as string);
      }

      let files: files[] = [];
      try {
        files = await db.files.findMany({
          where: {
            folder_id: args.folderId,
          },
        });

        if (!files) throw new Error("folder not found");
      } catch (err) {
        throw new Error(err as string);
      }

      return files;
    },
  },
  Mutation: {
    createFolder: async (_parent, args, context) => {
      if (!context.is_authed || context.user_id === undefined)
        throw new AuthenticationError("no login");

      if (args.data.name === "") throw new Error("name is empty");

      let folder: folders;

      try {
        if (args.data.parent_id) {
          const parent = await db.folders.findUnique({
            where: {
              folder_id: args.data.parent_id,
            },
            select: {
              user: {
                select: {
                  public_user_id: true,
                },
              },
            },
          });

          if (!parent) throw new Error("Parent folder not found");

          if (parent.user.public_user_id !== context.user_id.toString())
            throw new Error("You can't create folder in this folder");
        }

        const userId = await getUserByPublicId(context.user_id.toString());

        if (!userId) throw new Error("User not found");

        folder = await db.folders.create({
          data: {
            user_id: userId.user_id,
            name: args.data.name,
            parent_id: args.data.parent_id || null,
            color: args.data.color ? args.data.color : "#AAA",
            color_style: args.data.color_style ? args.data.color_style : "HEX",
          },
        });
      } catch (e) {
        throw new Error("Failed creating folder");
      }

      if (!folder) throw new Error("Failed creating folder");

      return folder;
    },
  },
};
