import { document, files, fileType, folders, todo, user } from "@prisma/client";
import { ResolverContext } from "../../context";
import { db } from "../../database";
import { Resolvers } from "../../graphql/types";
import { getUserByPublicId } from "../user/helpers";

export const FolderFilesResolver: Resolvers<ResolverContext> = {
  Query: {
    getFileContent: async (_parent, args, context) => {
      if (!context.user_id || !context.is_authed)
        throw new Error("User not authenticated");

      // Get File Content
      try {
        const fileContent = await db.files.findUnique({
          where: {
            file_id: args.data.fileId,
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

        console.log(fileContent);

        // Check if user can access the file
        if (
          fileContent &&
          fileContent.folders.user.public_user_id !== context.user_id
        )
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
    createFile: async (_parent, args, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("User not authenticated");

      let newFile: files | null = null;

      try {
        newFile = await db.files.create({
          data: {
            name: args.data.name,
            fileType: args.data.fileType || fileType.Document,
            folder_id: args.data.folder_id,
          },
        });

        if (args.data.fileType === fileType.Document) {
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
        console.log(err);
      }

      if (!newFile) throw new Error("Internal Error");

      return newFile;
    },
  },
};
