import { Priority, Todo } from "@graphql/graphql";
import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";
import { FormEvent, useEffect, useState } from "react";
import { gql } from "graphql-request";
import { gqlClient } from "@libs/graphql-request";
import Form from "@components/Form/Form/Form";
import Stack from "@components/Form/Stack/Stack";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Label from "@components/Form/Inputs/Label";
import Input from "@components/Form/Inputs/Input";
import { Listbox } from "@headlessui/react";
import Button from "@components/Form/Buttons/Button";
import { useRouter } from "next/router";
import { XIcon } from "@heroicons/react/solid";

interface props extends preMadeDialogNeeded {
  todo: Todo | undefined;
}

const prioritiesQuery = gql`
  query priorities {
    priorities {
      priority_id
      name
      color
      order
    }
  }
`;

const updateMutation = gql`
  mutation updateTodo(
    $id: ID!
    $text: String
    $remDate: Boolean
    $date: DateTime
    $status: TodoStatus
    $priority: ID
    $remPriority: Boolean
    $file: ID
  ) {
    updateTodo(
      id: $id
      text: $text
      date: $date
      status: $status
      priority: $priority
      file: $file
      remDate: $remDate
      remPriority: $remPriority
    )
  }
`;

export default function UpdateTodoDialog({ isOpen, onClose, todo }: props) {
  const router = useRouter();
  const [Priorities, setPriorities] = useState<Priority[]>([]);

  const [Text, setText] = useState("");
  const [Priority, setPriority] = useState<Priority | undefined>(undefined);
  const [DueDate, setDueDate] = useState<string>("");

  const fetchPriorities = async () => {
    await gqlClient
      .request(prioritiesQuery)
      .then((res) => {
        if (res.priorities) {
          if (res.priorities.length > 0) {
            setPriorities(res.priorities);
          }
        }
      })
      .catch((err) => {});
  };

  async function updateHandler(e: FormEvent) {
    e.preventDefault();
    let customVars = {};

    if (!Priority) {
      customVars = {
        ...customVars,
        priority: undefined,
        remPriority: true,
      };
    }

    if (!DueDate || DueDate === "") {
      customVars = {
        ...customVars,
        date: undefined,
        remDate: true,
      };
    }

    await gqlClient
      .request(updateMutation, {
        id: todo?.todo_id,
        text: Text,
        date: DueDate,
        priority: Priority?.priority_id,
        ...customVars,
      })
      .then((res) => {
        if (res.updateTodo) {
          router.reload();
          onClose();
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    fetchPriorities();
  }, []);

  useEffect(() => {
    if (todo) {
      setText("");
      setDueDate("");
      setPriority(undefined);

      setText(todo.text);
      // Covert date to yyyy-mm-dd
      if (todo.date) {
        const date = new Date(todo.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        setDueDate(
          `${year}-${month < 10 ? "0" : ""}${month}-${
            day < 10 ? "0" : ""
          }${day}`
        );
      }

      if (todo.priority) {
        Priorities.map((priority) => {
          if (priority.priority_id === todo.priority?.priority_id) {
            setPriority(priority);
          }
        });
      }
    }
  }, [todo]);

  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <div className="font-semibold text-xl mb-3">Atualizar Apontamento</div>
        <Form onSubmit={updateHandler}>
          <Stack type="col" className="space-y-2">
            <InputGroup>
              <Label text="Texto"></Label>
              <Input
                input={{
                  type: "text",
                  value: Text,
                  onChange: (e) => setText(e.target.value),
                }}
              ></Input>
            </InputGroup>
            <InputGroup>
              <Label text="Prioridade"></Label>
              <div className="">
                <Listbox value={Priority} onChange={setPriority}>
                  <div className="relative">
                    <Listbox.Button
                      className={`text-left outline-none w-full flex items-center bg-gray-200 px-2 py-2 rounded-xl`}
                    >
                      <div
                        className="w-4 h-4 rounded-full mr-1"
                        style={{
                          backgroundColor: Priority?.color,
                        }}
                      ></div>
                      {Priority ? Priority?.name : "Sem prioridade"}
                    </Listbox.Button>
                    <Listbox.Options
                      className={`bg-gray-200 absolute w-full outline-none p-2 rounded-md`}
                    >
                      {Priorities.map((priority) => (
                        <Listbox.Option
                          key={priority.priority_id}
                          value={priority}
                          className={`flex items-center hover:bg-blue-200 p-1 rounded-md cursor-pointer`}
                        >
                          <div
                            className="w-4 h-4 rounded-full mr-1"
                            style={{
                              backgroundColor: priority.color,
                            }}
                          ></div>
                          {priority.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
                <div
                  className="ml-2 text-md text-black text-opacity-75 hover:text-opacity-100 cursor-pointer"
                  onClick={() => {
                    setPriority(undefined);
                  }}
                >
                  Remover Prioridade
                </div>
              </div>
            </InputGroup>
            <InputGroup>
              <Label text="Data"></Label>
              <Input
                input={{
                  type: "date",
                  value: DueDate,
                  onChange: (e) => setDueDate(e.target.value),
                }}
              />
              <div
                className="ml-2 text-md text-black text-opacity-75 hover:text-opacity-100 cursor-pointer"
                onClick={() => {
                  setDueDate("");
                }}
              >
                Remover Data
              </div>
            </InputGroup>
            <Button>Atualizar</Button>
          </Stack>
        </Form>
      </PreMadeDialog>
    </>
  );
}
