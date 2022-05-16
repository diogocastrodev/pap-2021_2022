import { Todo, TodoStatus } from "@src/graphql/graphql";
import { gql } from "graphql-request";
import { createContext, useEffect, useState } from "react";
import { gqlClient } from "@libs/graphql-request";

const getTodosQuery = gql`
  query {
    getTodos {
      text
    }
  }
`;

const createTodoMutation = gql`
  mutation ($text: String!, $date: DateTime, $priority: ID, $file: ID) {
    createTodo(text: $text, date: $date, priority: $priority, file: $file) {
      text
      todo_id
      status
      date
      priority {
        priority_id
      }
    }
  }
`;

interface CreateTodoParams {
  text: string;
  date?: Date | undefined;
  priority?: string | undefined;
  file?: string | undefined;
}

interface UpdateTodoParams {
  text?: string;
  status?: TodoStatus;
  date?: Date | undefined;
  priority?: string | undefined;
  file?: string | undefined;
}

interface DeleteTodoParams {
  todoId: string;
}

interface DumpTodoParams {
  todoId: string;
}

interface props {
  children: React.ReactNode | React.ReactNode[] | undefined;
}

interface ContextTodos {
  todos: Todo[];
  loading: boolean;
  lastUpdate: Date;
}

interface ContextType {
  todos: ContextTodos;
  refreshTodos: () => void;
  addTodo: (params: CreateTodoParams) => void;
  updateTodo: (params: UpdateTodoParams) => void;
  deleteTodo: (params: DeleteTodoParams) => void;
  dumpTodo: (params: DumpTodoParams) => void;
}

// @ts-expect-error
const TodoContext = createContext<ContextType>({});

const TodoProvider = ({ children }: props) => {
  const [todos, setTodos] = useState<ContextTodos>({
    todos: [],
    loading: true,
    lastUpdate: new Date(),
  });

  const refreshTodos = async () => {
    await gqlClient
      .request(getTodosQuery)
      .then((data) => {
        setTodos({
          todos: data.getTodos,
          loading: false,
          lastUpdate: new Date(),
        });
      })
      .catch((err) => {});
  };

  const addTodo = async ({ text, date, file, priority }: CreateTodoParams) => {
    await gqlClient
      .request(createTodoMutation, {
        text,
        date,
        file,
        priority,
      })
      .then((data) => {
        setTodos({
          todos: [...todos.todos, data.createTodo],
          loading: false,
          lastUpdate: new Date(),
        });
      })
      .catch((err) => {});
  };

  const updateTodo = async ({
    text,
    file,
    date,
    priority,
    status,
  }: UpdateTodoParams) => {};

  const deleteTodo = async ({ todoId }: DeleteTodoParams) => {};

  const dumpTodo = async ({ todoId }: DumpTodoParams) => {};

  useEffect(() => {
    refreshTodos();
  }, []);

  return (
    <TodoContext.Provider
      value={{ todos, refreshTodos, addTodo, updateTodo, deleteTodo, dumpTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};
