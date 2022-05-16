import Label from "@components/Form/Inputs/Label";
import Input from "@components/Form/Inputs/Input";
import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Priority, Todo, TodoStatus } from "@src/graphql/graphql";
import { gqlClient } from "@libs/graphql-request";
import { gql } from "graphql-request";
import Button from "@components/Form/Buttons/Button";
import Form from "@components/Form/Form/Form";
import InputGroup from "@components/Form/Inputs/InputGroup";
import { Listbox } from "@headlessui/react";

const createTodoMutation = gql`
  mutation ($text: String!, $date: DateTime, $priority: ID, $file: ID) {
    createTodo(text: $text, date: $date, priority: $priority, file: $file) {
      status
      text
      date
      priority {
        priority_id
        name
        color
      }
    }
  }
`;

interface props extends preMadeDialogNeeded {
  file?: string;
  onCreate: (
    id: string,
    text: string,
    status: TodoStatus,
    priority: Priority,
    date: Date
  ) => void;
}

export default function CreateTodoDialog(props: props) {
  const [text, setText] = useState<string>("");
  const [date, setDate] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<Priority | undefined>({
    priority_id: "",
    name: "Prioridades",
    color: "#FFFFFF",
    created_at: "",
    order: 0,
    updated_at: "",
  });
  const [Priorities, setPriorities] = useState<Priority[] | undefined>(
    undefined
  );

  const textInput = useRef<HTMLDivElement>(null);

  const errorClasses = `ring-2 ring-red-500`;

  useEffect(() => {
    if (text === "") {
      const div = textInput.current;
      if (div) {
        const classes = div.className;
        if (classes.indexOf(errorClasses) === -1) {
          div.className = `${classes} ${errorClasses}`;
        }
      }
    } else {
      const div = textInput.current;
      if (div) {
        const classes = div.className;
        if (classes.indexOf(errorClasses) !== -1) {
          div.className = classes.replace(errorClasses, "");
        }
      }
    }
  }, [text]);

  const createTodo = async (e: FormEvent) => {
    e.preventDefault();

    if (text.length === 0) {
      const oldClasses = textInput.current?.className;
      textInput.current!.className = `${oldClasses} ${errorClasses}`;
      return;
    }
    try {
      console.log(props.file);
      await gqlClient
        .request(createTodoMutation, {
          file: props.file,
          date: date,
          priority: priority,
          text: text,
        })
        .then((res) => {
          const newTodo = res.createTodo as Todo;
          props.onCreate(
            newTodo.todo_id,
            newTodo.text,
            newTodo.status as TodoStatus,
            newTodo.priority as Priority,
            newTodo.date
          );
          setText("");
          setDate(undefined);
          setPriority(undefined);
          props.onClose();
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PreMadeDialog isOpen={props.isOpen} onClose={props.onClose}>
        <Form className="flex flex-col" method="POST" onSubmit={createTodo}>
          <div className="flex flex-col">
            <InputGroup>
              <Label text="Texto" />
              <Input
                input={{
                  value: text,
                  onChange: (e) => setText(e.target.value),
                  type: "text",
                  name: "fileName",
                  required: true,
                }}
                mainDiv={{
                  ref: textInput,
                }}
              />
            </InputGroup>
            <InputGroup>
              <Label text="Data" />
              <Input
                input={{
                  value: date,
                  onChange: (e) => setDate(e.target.value),
                  type: "datetime-local",
                  name: "fileDate",
                  required: true,
                }}
              />
            </InputGroup>
            <InputGroup className="">
              <Label text="Data" />
              <Listbox value={priority} onChange={setPriority}>
                <div className="relative">
                  <Listbox.Button className={`relative max-w-fit`}>
                    {priority?.name}
                  </Listbox.Button>
                  <Listbox.Options
                    className={`absolute bg-gray-200 p-2 rounded-md top-8 max-h-64 overflow-hidden overflow-y-auto`}
                  >
                    {Priorities ? (
                      Priorities.map((priority) => (
                        <Listbox.Option
                          key={priority.priority_id}
                          value={priority.priority_id}
                          className="cursor-pointer"
                        >
                          {({ active, selected }) => (
                            <div className={`${active && "bg-blue-300"}`}>
                              {priority.name}
                            </div>
                          )}
                        </Listbox.Option>
                      ))
                    ) : (
                      <Listbox.Option value={undefined} disabled={true}>
                        {`Não foram encontradas prioridades`}
                      </Listbox.Option>
                    )}
                  </Listbox.Options>
                </div>
              </Listbox>
            </InputGroup>
          </div>
          <Button className="mt-4">Criar Apontamento</Button>
        </Form>
      </PreMadeDialog>
    </>
  );
}
