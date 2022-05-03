import { Priority, Todo } from "../../graphql/types";
import { db } from "../../database";

interface Priorities {
  name: string;
  color: string;
}

export const defaultPriorities: Priorities[] = [
  {
    name: "Low",
    color: "#00bcd4",
  },
] as Priority[];

export async function changeTodoPriority(
  todo_id: string,
  priority_id: string
): Promise<Todo | null> {
  const todo = await db.todo.findUnique({
    where: {
      todo_id,
    },
    include: {
      priority: {
        select: {
          priority_id: true,
        },
      },
    },
  });

  if (todo.priority.priority_id === priority_id) {
    return null;
  }

  const newTodo = await db.todo.update({
    where: {
      todo_id,
    },
    data: {
      priority: {
        connect: {
          priority_id,
        },
      },
    },
  });

  return newTodo as Todo;
}
