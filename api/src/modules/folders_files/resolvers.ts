import { document, files, fileType, folders, todo, user } from "@prisma/client";
import { ResolverContext } from "../../context";
import { db } from "../../database";
import { Files, FileType, Resolvers } from "../../graphql/types";
import { getUserByPublicId } from "../user/helpers";

export const FolderFilesResolver: Resolvers<ResolverContext> = {
  Query: {
    getFileContent: async (_, { fileId }, { is_authed, user_id }) => {
      if (!user_id || !is_authed) throw new Error("User not authenticated");

      // Get File Content
      try {
        const fileContent = await db.files.findUnique({
          where: {
            file_id: fileId,
          },
          include: {
            folders: {
              include: {
                user: true,
              },
            },
            document: true,
            todos: true,
          },
        });

        // Check if user can access the file
        if (fileContent && fileContent.folders.user.public_user_id !== user_id)
          throw new Error("You cannot check other people's files content");

        return fileContent;
      } catch (err) {
        if (err) {
          const error = err as string;

          if (error.includes("Error: \nInvalid `db.files.findUnique()`")) {
            throw new Error("File not found");
          }

          throw new Error(err as string);
        }

        throw new Error(err as string);
      }
    },
  },
  Mutation: {
    createFile: async (
      _,
      { name, fileType, folder_id },
      { is_authed, user_id }
    ) => {
      if (!is_authed || !user_id) throw new Error("User not authenticated");

      try {
        const newFile = await db.files.create({
          data: {
            name: name,
            fileType: fileType,
            folder_id: folder_id,
          },
          include: {
            folders: true,
          },
        });

        if (!newFile) throw new Error("Internal Error");

        if (fileType === FileType.Document) {
          const newDocument = await db.document.create({
            data: {
              content: "",
              file_id: newFile.file_id,
            },
          });

          if (!newDocument) throw new Error("Error creating new Document");
        }

        return newFile;
      } catch (err) {
        throw new Error(err as string);
      }
    },
  },
};
