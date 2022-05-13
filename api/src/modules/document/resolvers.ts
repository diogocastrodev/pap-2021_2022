import { Context, ResolverContext } from "../../context";
import { db } from "../../database";
import {
  Document,
  FileType,
  Resolvers,
  SubscriptionUpdatedDocumentContentArgs,
} from "../../graphql/types";
import { pubsub } from "../../pubsub";

export const DocumentResolver: Resolvers<ResolverContext> = {
  Query: {},
  Mutation: {
    updateDocument: async (_, { id, content }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("User not authenticated");

      try {
        const userFile = await db.files.findUnique({
          where: {
            file_id: id,
          },
          select: {
            fileType: true,
            document: {
              select: {
                document_id: true,
              },
            },
            folders: {
              select: {
                user: {
                  select: {
                    public_user_id: true,
                  },
                },
              },
            },
          },
        });

        if (!userFile || !userFile.document || !userFile.document.document_id)
          throw new Error("File not found");

        if (userFile.fileType !== FileType.Document)
          throw new Error("File is not a document");

        if (userFile.folders.user.public_user_id !== user_id)
          throw new Error("You cannot update other people's files");

        let updatedDocument = await db.document.update({
          where: {
            document_id: userFile.document!.document_id,
          },
          data: {
            content: content,
          },
        });

        if (!updatedDocument) throw new Error("Document not updated");

        // add userId to updated document variable
        const newUpdatedDocument = {
          ...updatedDocument,
          user_id: userFile.folders.user.public_user_id,
        };

        pubsub.publish("updatedDocumentContent", newUpdatedDocument);

        return true;
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
  Subscription: {
    updatedDocumentContent: {
      // @ts-ignore
      subscribe: (parent, args, context) => {
        return pubsub.asyncIterator("updatedDocumentContent");
      },
      resolve: async (
        payload: SubUpdatedDocumentContentPayload,
        args: SubUpdatedDocumentContentArgs
      ) => {
        if (payload.files?.file_id !== args.id) {
          throw new Error("Document ID does not match");
        }

        return payload.content;
      },
    },
  },
};

interface SubUpdatedDocumentContentArgs {
  id: string;
}

interface SubUpdatedDocumentContentPayload extends Document {
  user_id: string;
}
