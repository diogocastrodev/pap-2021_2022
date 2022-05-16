import { Disclosure } from "@headlessui/react";
import { Todo, TodoStatus } from "@src/graphql/graphql";
import Stack from "@components/Form/Stack/Stack";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { ReactElement, useEffect, useState } from "react";

interface props {
  todos: Todo[];
}

export default function TodoDisclosures({ todos }: props) {
  const [pageTodos, setPageTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setPageTodos(todos);
  }, []);

  useEffect(() => {
    setPageTodos(todos);
  }, [todos]);

  // Handlers

  return (
    <>
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
                    ).length > 0 && `py-2 px-2 space-y-3`
                  }`}
                >
                  {pageTodos
                    .filter((todo) => todo.status === TodoStatus.Active)
                    .map((todo) => (
                      <div
                        key={todo.todo_id}
                        className={`flex flex-row items-center hover:font-bold`}
                      >
                        <div className="break-all overflow-x-hidden">
                          {todo.text}
                        </div>
                        <Stack type="row" className="ml-auto pl-3 space-x-1">
                          <Buttons
                            color="blue"
                            onClick={() => {}}
                            icon={<CheckIcon />}
                          />
                          <Buttons
                            color="red"
                            onClick={() => {}}
                            icon={<TrashIcon />}
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
                      .length > 0 && `py-2 px-2`
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
                            <div className="break-all overflow-x-hidden">
                              {todo.text}
                            </div>
                            <Stack
                              type="row"
                              className="ml-auto pl-3 space-x-1"
                            >
                              <Buttons
                                color="blue"
                                onClick={() => {}}
                                icon={<CheckIcon />}
                              />
                              <Buttons
                                color="red"
                                onClick={() => {}}
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
          {({ open }: { open: boolean }) => (
            <>
              <div className="bg-gray-100 rounded-lg">
                <Disclosure.Button className="text-left bg-red-200 w-full py-1 px-2 rounded-lg flex flex-row items-center">
                  Apagados (
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
                    ).length > 0 && `py-2 px-2`
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
                              className="ml-auto pl-3 space-x-1"
                            >
                              <Buttons
                                color="blue"
                                onClick={() => {}}
                                icon={<CheckIcon />}
                              />
                              <Buttons
                                color="red"
                                onClick={() => {}}
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
