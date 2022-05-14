import { ResolverContext } from "../../context";
import { Resolvers, TodoStatus } from "../../graphql/types";
import { db } from "../../database";
import { check } from "../../functions/check";

export const TodoResolver: Resolvers<ResolverContext> = {
  Query: {
    priorities: async (_, __, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      const priorities = await db.priority.findMany({
        where: {
          user: {
            public_user_id: user_id,
          },
        },
      });

      return priorities;
    },
    getTodo: async (_, { id }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

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

      if (todo.user.public_user_id !== user_id) throw new Error("Unauthorized");

      return todo;
    },
    getTodos: async (_, __, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      const todos = await db.todo.findMany({
        where: {
          user: {
            public_user_id: user_id,
          },
        },
        include: {
          priority: true,
          files: true,
        },
      });

      return todos;
    },
    getTodosByPriority: async (_, { priority }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      const todos = await db.todo.findMany({
        where: {
          priority: {
            priority_id: priority,
          },
          user: {
            public_user_id: user_id,
          },
        },
        include: {
          priority: true,
          files: true,
        },
      });

      return todos;
    },
    getTodosByFolder: async (_, { folder }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      const todos = await db.todo.findMany({
        where: {
          files: {
            folders: {
              folder_id: folder,
            },
          },
          user: {
            public_user_id: user_id,
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
    createPriority: async (_, { name, color }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      try {
        const color_hex = check.chars.color(color);

        const priority = await db.priority.create({
          data: {
            name,
            color: color_hex,
            user: {
              connect: {
                public_user_id: user_id,
              },
            },
          },
        });

        return priority;
      } catch (e) {
        throw new Error(e as string);
      }
    },
    updatePriority: async (_, { id, name, color }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

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

      if (isUpdatable.user.public_user_id !== user_id)
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
    deletePriority: async (_, { id }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

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

      if (isDeletable.user.public_user_id !== user_id)
        throw new Error("Unauthorized");

      const deletedPriority = await db.priority.delete({
        where: {
          priority_id: id,
        },
      });

      if (!deletedPriority) throw new Error("Priority not found");

      return true;
    },
    createTodo: async (
      _,
      { name, priority, file, date },
      { is_authed, user_id }
    ) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      interface INewData {
        text: string;
        status: TodoStatus;
        date?: Date;
        priority?: {
          connect: {
            priority_id: string;
          };
        };
        user: {
          connect: {
            public_user_id: string;
          };
        };
        files?: {
          connect: {
            file_id: string;
          };
        };
      }

      let newData: INewData = {
        text: name,
        date: date,
        status: TodoStatus.Active,
        user: {
          connect: {
            public_user_id: user_id,
          },
        },
      };

      if (priority && typeof priority === "string") {
        newData = {
          ...newData,
          priority: {
            connect: {
              priority_id: priority,
            },
          },
        };
      }

      if (file && typeof file !== null)
        newData = {
          ...newData,
          files: {
            connect: {
              file_id: file,
            },
          },
        };

      const todo = await db.todo.create({
        data: newData,
      });

      if (!todo) throw new Error("Todo not found");

      return todo;
    },
    updateTodo: async (
      _,
      { id, name, priority, file },
      { is_authed, user_id }
    ) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

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

      if (isUpdatable.user.public_user_id !== user_id)
        throw new Error("Unauthorized");

      if (name === "") name = null;

      let dataToUpdate = {};

      if (name && typeof name !== null)
        dataToUpdate = {
          ...dataToUpdate,
          todoText: name,
        };

      if (priority && typeof priority !== null)
        dataToUpdate = {
          ...dataToUpdate,
          priority: {
            connect: {
              priority_id: priority,
            },
          },
        };

      if (file && typeof file !== null)
        dataToUpdate = {
          ...dataToUpdate,
          files: {
            connect: {
              file_id: file,
            },
          },
        };

      const newTodo = await db.todo.update({
        where: {
          todo_id: id,
        },
        data: dataToUpdate,
      });

      if (!newTodo) throw new Error("Todo not found");

      return newTodo;
    },
    deleteTodo: async (_, { id }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

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

      if (isDeletable.user.public_user_id !== user_id)
        throw new Error("Unauthorized");

      const deletedTodo = await db.todo.delete({
        where: {
          todo_id: id,
        },
      });

      if (!deletedTodo) throw new Error("Todo not found");

      return true;
    },
  },
};
