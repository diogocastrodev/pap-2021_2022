import { ResolverContext } from "../../context";
import { db } from "../../database";
import { Resolvers } from "../../graphql/types";
import { getUserIDByPublicID } from "../user/helpers";

export const CollectionResolvers: Resolvers<ResolverContext> = {
  Query: {
    myCollections: async (_parent, args, context) => {
      if (!context.is_authed || !context.public_id)
        throw new Error("Unauthorized");

      const user_id = await getUserIDByPublicID(context.public_id);

      const collections = await db.collection.findMany({
        where: {
          user_id,
        },
        include: {
          collections_product: true,
        },
      });

      return collections;
    },
    myCollection: async (_parent, args, context) => {
      if (!context.is_authed || !context.public_id)
        throw new Error("Unauthorized");

      const user_id = await getUserIDByPublicID(context.public_id);

      const collection = await db.collection.findUnique({
        where: {
          collection_id: args.id.toString(),
        },
      });

      if (!collection) throw new Error("Collection not found");

      if (collection.user_id !== user_id) throw new Error("Unauthorized");

      const collectionItems = await db.collection.findUnique({
        where: {
          collection_id: collection.collection_id,
        },
        include: {
          user: true,
          collections_product: {
            include: {
              product: {
                include: {
                  product_images: true,
                },
              },
            },
          },
        },
      });

      if (!collectionItems) throw new Error("Collection not found");

      return collectionItems;
    },
  },
  Mutation: {
    createCollection: async (_parent, args, context) => {
      if (!context.is_authed || !context.public_id)
        throw new Error("Unauthorized");

      const user_id = await getUserIDByPublicID(context.public_id);

      const collection = await db.collection.create({
        data: {
          user_id,
          name: args.name,
        },
        include: {
          collections_product: true,
        },
      });

      if (!collection) throw new Error("Collection not created");

      return collection;
    },
    deleteCollection: async (_parent, args, context) => {
      if (!context.is_authed || !context.public_id)
        throw new Error("Unauthorized");

      const user_id = await getUserIDByPublicID(context.public_id);

      const collection = await db.collection.findUnique({
        where: {
          collection_id: args.id.toString(),
        },
      });

      if (!collection) throw new Error("Collection not found");

      if (collection.user_id !== user_id) throw new Error("Unauthorized");

      const deleteCollectionProducts = await db.collections_product.deleteMany({
        where: {
          collection_id: collection.collection_id,
        },
      });

      if (!deleteCollectionProducts)
        throw new Error("Collection products not deleted");

      const deletedCollection = await db.collection.delete({
        where: {
          collection_id: collection.collection_id,
        },
      });

      if (!deletedCollection) throw new Error("Collection not deleted");

      return true;
    },
    updateCollection: async (_parent, args, context) => {
      if (!context.is_authed || !context.public_id)
        throw new Error("Unauthorized");

      const user_id = await getUserIDByPublicID(context.public_id);

      const collection = await db.collection.findUnique({
        where: {
          collection_id: args.id.toString(),
        },
      });

      if (!collection) throw new Error("Collection not found");

      if (collection.user_id !== user_id) throw new Error("Unauthorized");

      const updatedCollection = await db.collection.update({
        where: {
          collection_id: collection.collection_id,
        },
        data: {
          name: args.name,
        },
      });

      if (!updatedCollection) throw new Error("Collection not deleted");

      return updatedCollection;
    },
    addProductToCollection: async (_parent, args, context) => {
      if (!context.is_authed || !context.public_id)
        throw new Error("Unauthorized");

      const user_id = await getUserIDByPublicID(context.public_id);

      const collection = await db.collection.findUnique({
        where: {
          collection_id: args.collectionId.toString(),
        },
      });

      if (!collection) throw new Error("Collection not found");

      if (collection.user_id !== user_id) throw new Error("Unauthorized");

      const collectionItem = await db.collections_product.create({
        data: {
          collection_id: collection.collection_id,
          product_id: args.productId.toString(),
        },
      });

      if (!collectionItem) throw new Error("Collection item not created");

      return collectionItem;
    },
    removeProductFromCollection: async (_parent, args, context) => {
      if (!context.is_authed || !context.public_id)
        throw new Error("Unauthorized");

      const user_id = await getUserIDByPublicID(context.public_id);

      const collection = await db.collection.findUnique({
        where: {
          collection_id: args.collectionId.toString(),
        },
        include: {
          collections_product: true,
        },
      });

      if (!collection) throw new Error("Collection not found");

      if (collection.user_id !== user_id) throw new Error("Unauthorized");

      const collectionToDelete = collection.collections_product.find(
        (collectionItem) =>
          collectionItem.product_id === args.productId &&
          collectionItem.collection_id === collection.collection_id
      );

      if (!collectionToDelete)
        throw new Error("Product not found in collection");

      const deletedCollectionItem = await db.collections_product.delete({
        where: {
          collection_product_id: collectionToDelete.collection_product_id,
        },
      });

      if (!deletedCollectionItem)
        throw new Error("Collection item not deleted");

      return true;
    },
  },
};
