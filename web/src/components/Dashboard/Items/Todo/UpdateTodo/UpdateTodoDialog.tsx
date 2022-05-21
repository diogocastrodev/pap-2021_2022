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
    await gqlClient
      .request(updateMutation, {
        id: todo?.todo_id,
        text: Text,
        date: DueDate,
        priority: Priority?.priority_id,
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
      setText(todo.text);
      setDueDate(todo.date ? todo.date.toString() : "");

      Priorities.map((priority) => {
        if (priority.priority_id === todo.priority?.priority_id) {
          setPriority(priority);
        }
      });
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
                      {Priority?.name}
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
            </InputGroup>
            <Button>Atualizar</Button>
          </Stack>
        </Form>
      </PreMadeDialog>
    </>
  );
}
