import { Folders, Resolvers, ReturnFolders } from "../../graphql/types";
import { ResolverContext } from "../../context";
import { AuthenticationError } from "apollo-server-errors";
import { db } from "../../database";
import { createDataTree } from "./helpers";
import { files, folders } from "@prisma/client";
import { getUserByPublicId } from "../user/helpers";
import { check } from "../../functions/check";

export const FolderResolver: Resolvers<ResolverContext> = {
  Query: {
    // @ts-ignore
    userFolders: async (_, __, { is_authed, user_id }) => {
      if (!is_authed || typeof user_id === "undefined")
        throw new AuthenticationError("no login");

      try {
        const userFolders = await db.folders.findMany({
          where: {
            user: {
              public_user_id: user_id.toString(),
            },
          },
          orderBy: {
            name: "asc",
          },
          include: {
            files: true,
          },
        });

        // replace parent_id null with empty string
        userFolders.forEach((folder) => {
          if (folder.parent_id === null) folder.parent_id = "";
        });

        const finalFolders = createDataTree(userFolders as Folders[]);

        return finalFolders;
      } catch (e) {
        throw new Error(e as string);
      }
    },
    getFilesByFolder: async (_, { folderId }, { is_authed, user_id }) => {
      if (!is_authed || typeof user_id === "undefined")
        throw new AuthenticationError("no login");

      try {
        const folder = await db.folders.findUnique({
          where: {
            folder_id: folderId,
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

        if (folder.user.public_user_id.toString() !== user_id.toString())
          throw new AuthenticationError("no access");

        const files = await db.files.findMany({
          where: {
            folder_id: folderId,
          },
        });

        if (!files) throw new Error("folder not found");

        return files;
      } catch (err) {
        throw new Error(err as string);
      }
    },
    getFolderById: async (_, { folderId }, { is_authed, user_id }) => {
      if (!is_authed || typeof user_id === "undefined")
        throw new Error("no login");

      try {
        const folder = await db.folders.findUnique({
          where: {
            folder_id: folderId,
          },
          include: {
            user: true,
            files: true,
            folders: true,
          },
        });

        if (!folder) throw new Error("folder not found");

        if (folder.user.public_user_id.toString() !== user_id.toString())
          throw new Error("no access");

        return folder;
      } catch (err) {
        throw new Error(err as string);
      }
    },
  },
  Mutation: {
    createFolder: async (
      _,
      { name, color, parent_id },
      { is_authed, user_id }
    ) => {
      if (!is_authed || user_id === undefined)
        throw new AuthenticationError("no login");

      if (name === "") throw new Error("name is empty");

      try {
        if (parent_id) {
          const parent = await db.folders.findUnique({
            where: {
              folder_id: parent_id,
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

          if (parent.user.public_user_id !== user_id.toString())
            throw new Error("You can't create folder in this folder");
        }

        interface CreateFolder {
          name: string;
          color?: string;
          user: {
            connect: {
              public_user_id: string;
            };
          };
          parent_folder?: {
            connect: {
              folder_id: string;
            };
          };
        }

        let data: CreateFolder = {
          name,
          user: {
            connect: {
              public_user_id: user_id,
            },
          },
        };

        if (color) data.color = check.chars.color(color);

        if (parent_id) {
          data = {
            ...data,
            parent_folder: {
              connect: {
                folder_id: parent_id,
              },
            },
          };
        }

        const folder = await db.folders.create({
          data,
        });

        if (!folder) throw new Error("Failed creating folder");

        return folder;
      } catch (e) {
        throw new Error(e as string);
      }
    },
  },
};
