import { ResolverContext } from "../../context";
import { Resolvers } from "../../graphql/types";
import { db } from "../../database";

export const TodoResolver: Resolvers<ResolverContext> = {
  Query: {
    priorities: async (_, __, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const priorities = await db.priority.findMany({
        where: {
          user: {
            public_user_id: context.user_id,
          },
        },
      });

      return priorities;
    },
  },
  Mutation: {
    createPriority: async (_, { data: { name, color } }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const priority = await db.priority.create({
        data: {
          name,
          color,
          user: {
            connect: {
              public_user_id: context.user_id,
            },
          },
        },
      });

      return priority;
    },
    updatePriority: async (_, { data: { id, name, color } }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const isUpdatable = await db.priority.findUnique({
        where: {
          priority_id: id,
        },
        include: {
          user: {
            select: {
              public_user_id: true,
            },
          },
        },
      });

      if (!isUpdatable) throw new Error("Priority not found");

      if (isUpdatable.user.public_user_id !== context.user_id)
        throw new Error("Unauthorized");

      const newPriority = await db.priority.update({
        where: {
          priority_id: id,
        },
        data: {
          name: name || "",
          color: color || "",
        },
      });

      if (!newPriority) throw new Error("Priority not found");

      return newPriority;
    },
    deletePriority: async (_, { data: { id } }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const isDeletable = await db.priority.findUnique({
        where: {
          priority_id: id,
        },
        include: {
          user: {
            select: {
              public_user_id: true,
            },
          },
        },
      });

      if (!isDeletable) throw new Error("Priority not found");

      if (isDeletable.user.public_user_id !== context.user_id)
        throw new Error("Unauthorized");

      const deletedPriority = await db.priority.delete({
        where: {
          priority_id: id,
        },
      });

      if (!deletedPriority) throw new Error("Priority not found");

      return true;
    },
  },
};
