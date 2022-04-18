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

      let fileContent:
        | (files & {
            folders: folders & {
              user: user;
            };
            document: document[];
            todos: todo[];
          })
        | null;

      // Get File Content
      try {
        fileContent = await db.files.findUnique({
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

        // Check if user can access the file
        if (
          fileContent &&
          fileContent.folders.user.public_user_id !== context.user_id
        )
          throw new Error("You cannot check other people's files content");
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

      return fileContent;
    },
    getAllTodos: async (_parent, args, context) => {
      if (!context.user_id || !context.is_authed)
        throw new Error("User not authenticated");

      let todos: todo[] = [];

      try {
        todos = await db.todo.findMany({
          where: {
            user: {
              public_user_id: context.user_id,
            },
          },
          include: {
            user: true,
            files: true,
          },
        });
      } catch (err) {
        console.log(err);
      }

      return todos;
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
              content: "# New Document!",
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
    createTodo: async (_parent, args, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("User not authenticated");

      let newTodo: todo | null = null;

      const userId = await getUserByPublicId(context.user_id);

      if (!userId) throw new Error("User not found");

      try {
        newTodo = await db.todo.create({
          data: {
            status: "ACTIVE",
            todoText: args.data.todoText,
            file_id: args.data.file_id,
            user_id: userId.user_id,
          },
        });
      } catch (err) {
        console.log(err);
      }

      if (!newTodo) throw new Error("Error creating TODO");

      return newTodo;
    },
  },
};
