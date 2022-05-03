import { Disclosure } from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { Todo, TodoStatus } from "@src/graphql/graphql";
import { graphQL_request_Client } from "@src/libs/graphql-request";
import { gql } from "graphql-request";
import { ReactElement, useEffect, useState } from "react";
import Button from "@components/Form/Buttons/Button";
import CreateTodoDialog from "./Todo/CreateTodo/CreateTodoDialog";
import Stack from "@components/Form/Stack/Stack";

interface props {
  id: string;
}

const getTodosQuery = gql`
  query ($data: getFileContentInput!) {
    getFileContent(data: $data) {
      name
      todos {
        todo_id
        todoText
        status
      }
    }
  }
`;

export default function TodoPage(props: props) {
  const [fileName, setFileName] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const getTodos = async () => {
    await graphQL_request_Client
      .request(getTodosQuery, {
        data: {
          fileId: props.id,
        },
      })
      .then((res) => {
        setFileName(res.getFileContent.name);
        setTodos(res.getFileContent.todos as Todo[]);
      });
  };

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const addTodo = async (id: string, text: string, status: TodoStatus) => {
    const todo = {
      todo_id: id,
      todoText: text,
      status: status,
    } as Todo;
    setTodos([...todos, todo]);
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
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
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
          <div className="text-sm text-opacity-75 text-black">
            Ficheiro: <span className="font-semibold">{fileName}</span>
          </div>
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
      <div className="space-y-2 flex flex-col w-full">
        <Disclosure>
          {({ open }) => (
            <>
              <div className="bg-gray-100 rounded-lg">
                <Disclosure.Button className="text-left bg-orange-200 w-full py-1 px-2 rounded-lg flex flex-row items-center">
                  Por Concluir (
                  {
                    todos.filter((todo) => todo.status === TodoStatus.Active)
                      .length
                  }
                  )
                  <div className="ml-auto h-5 w-5">
                    {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel
                  className={`text-black ${
                    todos.filter((todo) => todo.status === TodoStatus.Active)
                      .length > 0 && `py-2 px-2 space-y-3`
                  }`}
                >
                  {todos.map(
                    (todo) =>
                      todo.status === TodoStatus.Active && (
                        <div
                          key={todo.todo_id}
                          className={`flex flex-row items-center hover:font-bold`}
                        >
                          <div className="break-all overflow-x-hidden">
                            {todo.todoText}
                          </div>
                          <Stack type="row" className="ml-auto pl-3 space-x-1">
                            <Buttons
                              color="blue"
                              onClick={() => {
                                finishTodo(todo.todo_id);
                              }}
                              icon={<CheckIcon />}
                            />
                            <Buttons
                              color="red"
                              onClick={() => {
                                deleteTodo(todo.todo_id);
                              }}
                              icon={<TrashIcon />}
                            />
                          </Stack>
                        </div>
                      )
                  )}
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>
        {/* Concluidos */}
        <Disclosure>
          {({ open }) => (
            <>
              <div className="bg-gray-100 rounded-lg">
                <Disclosure.Button className="text-left bg-green-200 w-full py-1 px-2 rounded-lg flex flex-row items-center">
                  Concluidos (
                  {
                    todos.filter((todo) => todo.status === TodoStatus.Done)
                      .length
                  }
                  )
                  <div
                    className="ml-auto h-5 w-5"
                    title={`${open ? `Abrir` : `Fechar`}`}
                  >
                    {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel
                  className={`text-black ${
                    todos.filter((todo) => todo.status === TodoStatus.Done)
                      .length > 0 && `py-2 px-2`
                  }`}
                >
                  {todos.map(
                    (todo) =>
                      todo.status === TodoStatus.Done && (
                        <div
                          key={todo.todo_id}
                          className={`flex flex-row items-center hover:font-bold`}
                        >
                          <div className="break-all overflow-x-hidden">
                            {todo.todoText}
                          </div>
                          <Stack type="row" className="ml-auto pl-3 space-x-1">
                            <Buttons
                              color="blue"
                              onClick={() => {
                                finishTodo(todo.todo_id);
                              }}
                              icon={<CheckIcon />}
                            />
                            <Buttons
                              color="red"
                              onClick={() => {
                                deleteTodo(todo.todo_id);
                              }}
                              icon={<TrashIcon />}
                            />
                          </Stack>
                        </div>
                      )
                  )}
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>
        {/* Apagados */}
        <Disclosure>
          {({ open }) => (
            <>
              <div className="bg-gray-100 rounded-lg">
                <Disclosure.Button className="text-left bg-red-200 w-full py-1 px-2 rounded-lg flex flex-row items-center">
                  Apagados (
                  {
                    todos.filter((todo) => todo.status === TodoStatus.Deleted)
                      .length
                  }
                  )
                  <div className="ml-auto h-5 w-5">
                    {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel
                  className={`text-black ${
                    todos.filter((todo) => todo.status === TodoStatus.Deleted)
                      .length > 0 && `py-2 px-2`
                  }`}
                >
                  {todos.map(
                    (todo) =>
                      todo.status === TodoStatus.Deleted && (
                        <div
                          key={todo.todo_id}
                          className={`flex flex-row items-center hover:font-bold`}
                        >
                          <div className="break-all overflow-x-hidden">
                            {todo.todoText}
                          </div>
                          <Stack type="row" className="ml-auto pl-3 space-x-1">
                            <Buttons
                              color="blue"
                              onClick={() => {
                                finishTodo(todo.todo_id);
                              }}
                              icon={<CheckIcon />}
                            />
                            <Buttons
                              color="red"
                              onClick={() => {
                                deleteTodo(todo.todo_id);
                              }}
                              icon={<TrashIcon />}
                            />
                          </Stack>
                        </div>
                      )
                  )}
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>
      </div>
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
