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
    getTodo: async (_, { id }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const todo = await db.todo.findUnique({
        where: {
          todo_id: id,
        },
        include: {
          priority: true,
          user: {
            select: {
              public_user_id: true,
            },
          },
        },
      });

      if (!todo) throw new Error("Todo not found");

      if (todo.user.public_user_id !== context.user_id)
        throw new Error("Unauthorized");

      return todo;
    },
    getTodos: async (_, __, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const todos = await db.todo.findMany({
        where: {
          user: {
            public_user_id: context.user_id,
          },
        },
        include: {
          priority: true,
          files: true,
        },
      });

      return todos;
    },
    getTodosByPriority: async (_, { priority }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const todos = await db.todo.findMany({
        where: {
          priority: {
            priority_id: priority,
          },
          user: {
            public_user_id: context.user_id,
          },
        },
        include: {
          priority: true,
          files: true,
        },
      });

      return todos;
    },
    getTodosByFolder: async (_, { folder }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const todos = await db.todo.findMany({
        where: {
          files: {
            folders: {
              folder_id: folder,
            },
          },
          user: {
            public_user_id: context.user_id,
          },
        },
        include: {
          priority: true,
          files: true,
        },
      });

      return todos;
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
    createTodo: async (_, { data: { name, priority, file } }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const todo = await db.todo.create({
        data: {
          todoText: name,
          status: "ACTIVE",
          priority: {
            connect: {
              priority_id: priority,
            },
          },
          user: {
            connect: {
              public_user_id: context.user_id,
            },
          },
          files: {
            connect: {
              file_id: file,
            },
          },
        },
      });

      if (!todo) throw new Error("Todo not found");

      return todo;
    },
    updateTodo: async (_, { data: { id, name, priority, file } }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const isUpdatable = await db.todo.findUnique({
        where: {
          todo_id: id,
        },
        include: {
          user: {
            select: {
              public_user_id: true,
            },
          },
        },
      });

      if (!isUpdatable) throw new Error("Todo not found");

      if (isUpdatable.user.public_user_id !== context.user_id)
        throw new Error("Unauthorized");

      const newTodo = await db.todo.update({
        where: {
          todo_id: id,
        },
        data: {
          todoText: name || "",
          priority: {
            connect: {
              priority_id: priority,
            },
          },
          files: {
            connect: {
              file_id: file,
            },
          },
        },
      });

      if (!newTodo) throw new Error("Todo not found");

      return newTodo;
    },
    deleteTodo: async (_, { data: { id } }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const isDeletable = await db.todo.findUnique({
        where: {
          todo_id: id,
        },
        include: {
          user: {
            select: {
              public_user_id: true,
            },
          },
        },
      });

      if (!isDeletable) throw new Error("Todo not found");

      if (isDeletable.user.public_user_id !== context.user_id)
        throw new Error("Unauthorized");

      const deletedTodo = await db.todo.delete({
        where: {
          todo_id: id,
        },
      });

      if (!deletedTodo) throw new Error("Todo not found");

      return true;
    },
    changeTodoPriority: async (_, { data: { id, priority } }, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("Unauthorized");

      const isUpdatable = await db.todo.findUnique({
        where: {
          todo_id: id,
        },
        include: {
          user: {
            select: {
              public_user_id: true,
            },
          },
        },
      });

      if (!isUpdatable) throw new Error("Todo not found");

      if (isUpdatable.user.public_user_id !== context.user_id)
        throw new Error("Unauthorized");

      const newTodo = await db.todo.update({
        where: {
          todo_id: id,
        },
        data: {
          priority: {
            connect: {
              priority_id: priority,
            },
          },
        },
      });

      if (!newTodo) throw new Error("Todo not found");

      return newTodo;
    },
  },
};
