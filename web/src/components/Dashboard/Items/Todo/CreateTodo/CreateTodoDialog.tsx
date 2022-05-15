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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<string | undefined>(undefined);

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
          </div>
          <Button>Criar Apontamento</Button>
        </Form>
      </PreMadeDialog>
    </>
  );
}
