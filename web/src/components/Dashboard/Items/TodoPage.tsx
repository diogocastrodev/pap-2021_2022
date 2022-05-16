import { Disclosure } from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { Priority, Todo, TodoStatus } from "@src/graphql/graphql";
import { gqlClient } from "@src/libs/graphql-request";
import { gql } from "graphql-request";
import { ReactElement, useEffect, useState } from "react";
import Button from "@components/Form/Buttons/Button";
import CreateTodoDialog from "./Todo/CreateTodo/CreateTodoDialog";
import Stack from "@components/Form/Stack/Stack";
import { toast } from "react-toastify";
import TodoDisclosures from "./Todo/TodosDisclosure/TodosDisclosure";

interface props {
  id?: string;
}

const getFileNameQuery = gql`
  query ($fileId: ID!) {
    getFileContent(fileId: $fileId) {
      name
    }
  }
`;

const getTodosQuery = gql`
  query ($file: ID!) {
    getTodosByFile(file: $file) {
      todo_id
      text
      date
      status
      priority {
        priority_id
      }
    }
  }
`;

export default function TodoPage(props: props) {
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [todos, setTodos] = useState<Todo[]>([]);

  const getFileName = async () => {
    setFileName(undefined);
    await gqlClient
      .request(getFileNameQuery, {
        fileId: props.id,
      })
      .then((res) => {
        setFileName(res.getFileContent.name);
      });
  };

  const getTodos = async () => {
    setTodos([]);
    await gqlClient
      .request(getTodosQuery, {
        file: props.id,
      })
      .then((res) => {
        setTodos(res.getTodosByFile as Todo[]);
      });
  };

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const addTodo = async (
    id: string,
    text: string,
    status: TodoStatus,
    priority: Priority | undefined,
    date: Date | undefined
  ) => {
    const todo = {
      todo_id: id,
      text,
      status,
      date,
      priority,
    } as Todo;
    setTodos([...todos, todo]);
    toast.success("Apontamento adicionado");
  };

  const resTodo = async (todoId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.todo_id === todoId) {
          todo.status = TodoStatus.Active;
        }
        return todo;
      })
    );
    toast.success("Apontamento recuperado");
  };

  const finishTodo = async (todoId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.todo_id === todoId) {
          todo.status = TodoStatus.Done;
        }
        return todo;
      })
    );
    toast.success("Apontamento concluído");
  };

  const deleteTodo = async (todoId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.todo_id === todoId) {
          todo.status = TodoStatus.Deleted;
        }
        return todo;
      })
    );
    toast.success("Apontamento apagado");
  };

  useEffect(() => {
    getFileName();
    getTodos();
  }, []);

  useEffect(() => {
    getFileName();
    getTodos();
  }, [props.id]);

  return (
    <>
      <CreateTodoDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        file={props.id}
        onCreate={addTodo}
      />
      <div className="flex flex-row items-center flex-1">
        <div className="flex flex-col">
          <div className="text-lg">Tem: {todos.length} apontamentos</div>
          {fileName && (
            <div className="text-sm text-opacity-75 text-black">
              Ficheiro: <span className="font-semibold">{fileName}</span>
            </div>
          )}
        </div>
        <div className="ml-auto">
          <Button
            onClick={() => {
              setIsCreateDialogOpen(true);
            }}
          >
            Criar Apontamento
          </Button>
        </div>
      </div>
      <div className="my-1 border-b-2 border-gray-100"></div>
      <TodoDisclosures todos={todos} />
    </>
  );
}

interface IButtons {
  onClick: () => any;
  color: string;
  icon: ReactElement;
}

const Buttons = ({ onClick, color, icon }: IButtons) => {
  return (
    <>
      <div
        className={`h-6 w-6 bg-${color}-200 hover:bg-${color}-300 cursor-pointer rounded-full flex justify-center items-center`}
        onClick={onClick}
      >
        <div className="h-5 w-5">{icon}</div>
      </div>
    </>
  );
};
