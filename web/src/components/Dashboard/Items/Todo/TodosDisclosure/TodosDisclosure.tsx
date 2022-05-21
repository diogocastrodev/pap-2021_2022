import { Disclosure } from "@headlessui/react";
import { Priority, Todo, TodoStatus } from "@src/graphql/graphql";
import Stack from "@components/Form/Stack/Stack";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  CheckIcon,
  CogIcon,
  ReplyIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { ReactElement, useEffect, useState } from "react";
import { gql } from "graphql-request";
import { gqlClient } from "@libs/graphql-request";
import { lightHex } from "@src/functions/colors";
import { toast } from "react-toastify";
import moment from "moment";
import UpdateTodoDialog from "../UpdateTodo/UpdateTodoDialog";

interface props {
  todos: Todo[];
  onDump: (todoId: string) => void;
}

const getPriorities = gql`
  query {
    priorities {
      priority_id
      name
      color
    }
  }
`;

const updateTodo = gql`
  mutation (
    $id: ID!
    $text: String
    $date: DateTime
    $status: TodoStatus
    $priority: ID
    $file: ID
  ) {
    updateTodo(
      id: $id
      text: $text
      date: $date
      status: $status
      priority: $priority
      file: $file
    )
  }
`;

const dumpTodo = gql`
  mutation ($id: ID!) {
    dumpTodo(id: $id)
  }
`;

export default function TodoDisclosures({ todos, onDump }: props) {
  const [pageTodos, setPageTodos] = useState<Todo[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);

  const [updateTodoOpen, setUpdateTodoOpen] = useState<boolean>(false);
  const [updateTodoID, setUpdateTodoID] = useState<Todo | undefined>(undefined);

  async function fetchPriorities() {
    await gqlClient
      .request(getPriorities)
      .then((res) => {
        setPriorities(res.priorities);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    setPageTodos(todos);
  }, []);

  useEffect(() => {
    fetchPriorities();
  }, []);

  useEffect(() => {
    setPageTodos(todos);
  }, [todos]);

  // Handlers

  async function finishTodo(todoId: string) {
    await gqlClient
      .request(updateTodo, {
        id: todoId,
        status: TodoStatus.Done,
      })
      .then(() => {
        const newTodos = todos.map((todo) => {
          if (todo.todo_id === todoId) {
            todo.status = TodoStatus.Done;
          }
          return todo;
        });
        setPageTodos(newTodos);
        toast.success("Apontamento concluído!");
      })
      .catch((e) => {});
  }

  async function restoreTodo(todoId: string) {
    await gqlClient
      .request(updateTodo, {
        id: todoId,
        status: TodoStatus.Active,
      })
      .then(() => {
        const newTodos = todos.map((todo) => {
          if (todo.todo_id === todoId) {
            todo.status = TodoStatus.Active;
          }
          return todo;
        });
        setPageTodos(newTodos);
        toast.success("Apontamento restaurado!");
      })
      .catch((e) => {});
  }

  async function binTodo(todoId: string) {
    await gqlClient
      .request(updateTodo, {
        id: todoId,
        status: TodoStatus.Deleted,
      })
      .then(() => {
        const newTodos = todos.map((todo) => {
          if (todo.todo_id === todoId) {
            todo.status = TodoStatus.Deleted;
          }
          return todo;
        });
        setPageTodos(newTodos);
        toast.success("Apontamento movido para a lixeira!");
      })
      .catch((e) => {});
  }

  async function deleteTodo(todoId: string) {
    await gqlClient
      .request(dumpTodo, {
        id: todoId,
      })
      .then(() => {
        onDump(todoId);
        const newTodos = todos.filter((todo) => todo.todo_id !== todoId);
        setPageTodos(newTodos);
        toast.success("Apontamento apagado!");
      })
      .catch((e) => {});
  }

  return (
    <>
      <UpdateTodoDialog
        isOpen={updateTodoOpen}
        onClose={() => setUpdateTodoOpen(false)}
        todo={updateTodoID}
      />
      <div className="space-y-2 flex flex-col w-full">
        <Disclosure defaultOpen={true}>
          {({ open }: { open: boolean }) => (
            <>
              <div className="bg-gray-100 rounded-lg">
                <Disclosure.Button className="text-left bg-orange-200 w-full py-1 px-2 rounded-lg flex flex-row items-center">
                  Por Concluir (
                  {
                    pageTodos.filter(
                      (todo) => todo.status === TodoStatus.Active
                    ).length
                  }
                  )
                  <div className="ml-auto h-5 w-5">
                    {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel
                  className={`text-black ${
                    pageTodos.filter(
                      (todo) => todo.status === TodoStatus.Active
                    ).length > 0 && `py-2 px-2 space-y-1`
                  }`}
                >
                  {pageTodos
                    .filter((todo) => todo.status === TodoStatus.Active)
                    .map((todo) => (
                      <div
                        key={todo.todo_id}
                        className={`flex flex-row items-center group`}
                      >
                        <div className="break-all overflow-x-hidden group-hover:font-semibold">
                          {todo.text}
                        </div>
                        <Stack
                          type="row"
                          className="ml-auto pl-3 space-x-1 items-center"
                        >
                          <div>
                            {todo.priority &&
                              priorities.map(
                                (priority, i) =>
                                  priority.priority_id ===
                                    todo.priority?.priority_id && (
                                    <div
                                      className="px-2 py-1 rounded-full select-none"
                                      key={i}
                                      style={{
                                        backgroundColor: priority.color,
                                        color: lightHex(priority.color),
                                      }}
                                    >
                                      {priority.name}
                                    </div>
                                  )
                              )}
                          </div>
                          <Buttons
                            color="gray"
                            onClick={() => {
                              setUpdateTodoID(todo);
                              setUpdateTodoOpen(true);
                            }}
                            icon={<CogIcon className="w-4" />}
                          />
                          <Buttons
                            color="blue"
                            onClick={() => {
                              finishTodo(todo.todo_id);
                            }}
                            icon={<CheckIcon />}
                          />
                          <Buttons
                            color="orange"
                            onClick={() => {
                              binTodo(todo.todo_id);
                            }}
                            icon={<TrashIcon />}
                          />
                          <Buttons
                            color="red"
                            onClick={() => {
                              deleteTodo(todo.todo_id);
                            }}
                            icon={<BanIcon />}
                          />
                        </Stack>
                      </div>
                    ))}
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>
        {/* Concluidos */}
        <Disclosure>
          {({ open }: { open: boolean }) => (
            <>
              <div className="bg-gray-100 rounded-lg">
                <Disclosure.Button className="text-left bg-green-200 w-full py-1 px-2 rounded-lg flex flex-row items-center">
                  Concluidos (
                  {
                    pageTodos.filter((todo) => todo.status === TodoStatus.Done)
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
                    pageTodos.filter((todo) => todo.status === TodoStatus.Done)
                      .length > 0 && `py-2 px-2 space-y-1`
                  }`}
                >
                  {pageTodos
                    .filter((todo) => todo.status === TodoStatus.Done)
                    .map(
                      (todo) =>
                        todo.status === TodoStatus.Done && (
                          <div
                            key={todo.todo_id}
                            className={`flex flex-row items-center hover:font-bold`}
                          >
                            <Stack type="col">
                              <div className="break-all overflow-x-hidden">
                                {todo.text}
                              </div>
                              {todo.date && (
                                <div className="text-gray-600 text-sm">
                                  {moment(todo.date).format("DD/MM/YYYY")}
                                </div>
                              )}
                            </Stack>
                            <Stack
                              type="row"
                              className="ml-auto pl-3 space-x-1 items-center"
                            >
                              <div>
                                {todo.priority &&
                                  priorities.map(
                                    (priority, i) =>
                                      priority.priority_id ===
                                        todo.priority?.priority_id && (
                                        <div
                                          className="px-2 py-1 rounded-full select-none"
                                          key={i}
                                          style={{
                                            backgroundColor: priority.color,
                                            color: lightHex(priority.color),
                                          }}
                                        >
                                          {priority.name}
                                        </div>
                                      )
                                  )}
                              </div>
                              <Buttons
                                color="gray"
                                onClick={() => {
                                  setUpdateTodoID(todo);
                                  setUpdateTodoOpen(true);
                                }}
                                icon={<CogIcon className="w-4" />}
                              />
                              <Buttons
                                color="blue"
                                onClick={() => {
                                  restoreTodo(todo.todo_id);
                                }}
                                icon={<ReplyIcon className="rotate-90 w-4" />}
                              />
                              <Buttons
                                color="orange"
                                onClick={() => {
                                  binTodo(todo.todo_id);
                                }}
                                icon={<TrashIcon />}
                              />
                              <Buttons
                                color="red"
                                onClick={() => {
                                  deleteTodo(todo.todo_id);
                                }}
                                icon={<BanIcon />}
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
          {({ open }: { open: boolean }) => (
            <>
              <div className="bg-gray-100 rounded-lg">
                <Disclosure.Button className="text-left bg-red-200 w-full py-1 px-2 rounded-lg flex flex-row items-center">
                  Lixeira (
                  {
                    pageTodos.filter(
                      (todo) => todo.status === TodoStatus.Deleted
                    ).length
                  }
                  )
                  <div className="ml-auto h-5 w-5">
                    {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel
                  className={`text-black ${
                    pageTodos.filter(
                      (todo) => todo.status === TodoStatus.Deleted
                    ).length > 0 && `py-2 px-2 space-y-1`
                  }`}
                >
                  {pageTodos
                    .filter((todo) => todo.status === TodoStatus.Deleted)
                    .map(
                      (todo) =>
                        todo.status === TodoStatus.Deleted && (
                          <div
                            key={todo.todo_id}
                            className={`flex flex-row items-center hover:font-bold`}
                          >
                            <div className="break-all overflow-x-hidden">
                              {todo.text}
                            </div>
                            <Stack
                              type="row"
                              className="ml-auto pl-3 space-x-1 items-center"
                            >
                              <div>
                                {todo.priority &&
                                  priorities.map(
                                    (priority, i) =>
                                      priority.priority_id ===
                                        todo.priority?.priority_id && (
                                        <div
                                          className="px-2 py-1 rounded-full select-none"
                                          key={i}
                                          style={{
                                            backgroundColor: priority.color,
                                            color: lightHex(priority.color),
                                          }}
                                        >
                                          {priority.name}
                                        </div>
                                      )
                                  )}
                              </div>
                              <Buttons
                                color="gray"
                                onClick={() => {
                                  setUpdateTodoID(todo);
                                  setUpdateTodoOpen(true);
                                }}
                                icon={<CogIcon className="w-4" />}
                              />
                              <Buttons
                                color="blue"
                                onClick={() => {
                                  restoreTodo(todo.todo_id);
                                }}
                                icon={<ReplyIcon className="rotate-90 w-4" />}
                              />
                              <Buttons
                                color="red"
                                onClick={() => {
                                  deleteTodo(todo.todo_id);
                                }}
                                icon={<BanIcon />}
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
        <div className="h-5 w-5 flex items-center justify-center">{icon}</div>
      </div>
    </>
  );
};
