import Label from "@components/Form/Inputs/Label";
import Input from "@components/Form/Inputs/Input";
import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Todo, TodoStatus } from "@src/graphql/graphql";
import { graphQL_request_Client } from "@libs/graphql-request";
import { gql } from "graphql-request";
import Button from "@components/Form/Buttons/Button";

const createTodoMutation = gql`
  mutation ($data: createTodoInput!) {
    createTodo(data: $data) {
      file_id
      status
      todoText
    }
  }
`;

interface props extends preMadeDialogNeeded {
  file?: string;
  onCreate: (id: string, text: string, status: TodoStatus) => void;
}

export default function (props: props) {
  const [text, setText] = useState<string>("");

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
        console.log(classes);
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
      await graphQL_request_Client
        .request(createTodoMutation, {
          data: {
            file_id: props.file,
            todoText: text,
          },
        })
        .then((res) => {
          const newTodo = res.createTodo as Todo;
          props.onCreate(
            newTodo.todo_id,
            newTodo.todoText,
            newTodo.status as TodoStatus
          );
          setText("");
          props.onClose();
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PreMadeDialog isOpen={props.isOpen} onClose={props.onClose}>
        <form className="flex flex-col" method="POST" onSubmit={createTodo}>
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
        </form>
      </PreMadeDialog>
    </>
  );
}
