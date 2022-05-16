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
        include: {
          todos: true,
        },
        orderBy: {
          order: "desc",
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
          files: true,
          user: {
            select: {
              public_user_id: true,
            },
          },
        },
      });

      if (!todo) throw new Error("Todo not found");

      if (todo.user.public_user_id !== user_id) throw new Error("Unauthorized");

      if (todo.status === "DUMPED") throw new Error("Todo not found");

      return todo;
    },
    getTodos: async (_, __, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");
      try {
        const priorityTodos = await db.todo.findMany({
          where: {
            user: {
              public_user_id: user_id,
            },
            AND: {
              NOT: [
                {
                  status: "DUMPED",
                },
                {
                  priorityPriority_id: null,
                },
              ],
            },
          },
          include: {
            priority: true,
            files: true,
          },
          orderBy: {
            priority: {
              order: "desc",
            },
          },
        });

        const normalTodos = await db.todo.findMany({
          where: {
            user: {
              public_user_id: user_id,
            },
            AND: {
              NOT: {
                status: "DUMPED",
              },
            },
          },
          include: {
            priority: true,
            files: true,
          },
        });

        const noPriority = normalTodos.filter((todo) => {
          return todo.priorityPriority_id === null;
        });

        const todos = [...priorityTodos, ...noPriority];

        return todos;
      } catch (error) {
        throw new Error(error as string);
      }
    },
    getDatedTodos: async (_, __, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      try {
        const priorityTodos = await db.todo.findMany({
          where: {
            user: {
              public_user_id: user_id,
            },
            AND: {
              NOT: [
                {
                  status: "DUMPED",
                },
                {
                  priorityPriority_id: null,
                },
                {
                  date: null,
                },
              ],
            },
          },
          include: {
            priority: true,
            files: true,
          },
          orderBy: {
            priority: {
              order: "desc",
            },
          },
        });

        const normalTodos = await db.todo.findMany({
          where: {
            user: {
              public_user_id: user_id,
            },
            AND: {
              NOT: [
                {
                  status: "DUMPED",
                },
                {
                  date: null,
                },
              ],
            },
          },
          include: {
            priority: true,
            files: true,
          },
        });

        const noPriority = normalTodos.filter((todo) => {
          return todo.priorityPriority_id === null;
        });

        const todos = [...priorityTodos, ...noPriority];

        return todos;
      } catch (e) {
        throw new Error(e as string);
      }
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
          AND: {
            NOT: {
              status: "DUMPED",
            },
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
          AND: {
            NOT: {
              status: "DUMPED",
            },
          },
        },
        include: {
          priority: true,
          files: true,
        },
      });

      return todos;
    },
    getTodosByFile: async (_, { file }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");
      try {
        const priorityTodos = await db.todo.findMany({
          where: {
            user: {
              public_user_id: user_id,
            },
            files: {
              file_id: file,
            },
            AND: {
              NOT: [
                {
                  status: "DUMPED",
                },
                {
                  priorityPriority_id: null,
                },
              ],
            },
          },
          include: {
            priority: true,
            files: true,
          },
          orderBy: {
            priority: {
              order: "desc",
            },
          },
        });

        const normalTodos = await db.todo.findMany({
          where: {
            user: {
              public_user_id: user_id,
            },
            files: {
              file_id: file,
            },
            AND: {
              NOT: {
                status: "DUMPED",
              },
            },
          },
          include: {
            priority: true,
            files: true,
          },
        });

        const noPriority = normalTodos.filter((todo) => {
          return todo.priorityPriority_id === null;
        });

        const todos = [...priorityTodos, ...noPriority];

        return todos;
      } catch (error) {
        throw new Error(error as string);
      }
    },
  },
  Mutation: {
    createPriority: async (
      _,
      { name, color, order },
      { is_authed, user_id }
    ) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      try {
        if (order < 0 || order > 999)
          throw new Error("Order must be between 0 and 999");

        const color_hex = check.chars.color(color);

        const priority = await db.priority.create({
          data: {
            name,
            color: color_hex,
            order: order,
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
    updatePriority: async (
      _,
      { id, name, color, order },
      { is_authed, user_id }
    ) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      if (!order || order < 0 || order > 999)
        throw new Error("Order must be between 0 and 999");

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

      interface IDataToUpdate {
        name?: string;
        color?: string;
        order?: number;
      }

      const dataToUpdate: IDataToUpdate = {};

      if (name) dataToUpdate.name = name;
      if (color) dataToUpdate.color = check.chars.color(color);
      if (order && order >= 0 && 999 >= order) dataToUpdate.order = order;

      const newPriority = await db.priority.update({
        where: {
          priority_id: id,
        },
        data: dataToUpdate,
      });

      if (!newPriority) throw new Error("Priority not found");

      return newPriority;
    },
    deletePriority: async (
      _,
      { id, removeTodos, otherPriority },
      { is_authed, user_id }
    ) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      try {
        const isDeletable = await db.priority.findUnique({
          where: {
            priority_id: id,
          },
          select: {
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

        if (removeTodos) {
          // Delete all todos with this priority
          await db.todo.updateMany({
            where: {
              priority: {
                priority_id: id,
              },
            },
            data: {
              status: "DUMPED",
              priorityPriority_id: null,
            },
          });
        } else {
          if (otherPriority) {
            // Update the todos to another priority
            await db.todo.updateMany({
              where: {
                priority: {
                  priority_id: id,
                },
              },
              data: {
                priorityPriority_id: otherPriority,
              },
            });
          } else {
            // Remove priority from todos
            await db.todo.updateMany({
              where: {
                priority: {
                  priority_id: id,
                },
              },
              data: {
                priorityPriority_id: null,
              },
            });
          }
        }

        // Delete the Priority after all
        const deletedPriority = await db.priority.delete({
          where: {
            priority_id: id,
          },
        });

        if (!deletedPriority) throw new Error("Priority not found");

        return true;
      } catch (e) {
        throw new Error(e as string);
      }
    },
    createTodo: async (
      _,
      { text, priority, file, date },
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
        text: text,
        date: new Date(date),
        status: TodoStatus.Active,
        user: {
          connect: {
            public_user_id: user_id,
          },
        },
      };

      if (
        priority &&
        typeof priority === "string" &&
        priority !== "" &&
        priority.length > 0
      ) {
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
      { id, text, priority, file, status, date },
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

      if (text === "") text = null;

      let dataToUpdate = {};

      if (text && typeof text !== null)
        dataToUpdate = {
          ...dataToUpdate,
          todoText: text,
        };

      if (status && typeof status !== null)
        dataToUpdate = {
          ...dataToUpdate,
          status: status as TodoStatus,
        };

      if (date && typeof date !== null && date !== "")
        dataToUpdate = {
          ...dataToUpdate,
          date: new Date(date),
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

      return true;
    },
    dumpTodo: async (_, { id }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("Unauthorized");

      const isDumpable = await db.todo.findUnique({
        where: {
          todo_id: id,
        },
        select: {
          user: {
            select: {
              public_user_id: true,
            },
          },
        },
      });

      if (!isDumpable) throw new Error("Todo not found");

      if (isDumpable.user.public_user_id !== user_id)
        throw new Error("Unauthorized");

      const dumpedTodo = await db.todo.update({
        where: {
          todo_id: id,
        },
        data: {
          status: TodoStatus.Dumped,
        },
      });

      if (!dumpedTodo) throw new Error("Todo not found");

      return true;
    },
  },
};
