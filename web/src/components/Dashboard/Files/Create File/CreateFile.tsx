import Stack from "@components/Form/Stack/Stack";
import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";
import Input from "@components/Form/Inputs/Input";
import { FormEvent, useEffect, useRef, useState } from "react";
import Label from "@components/Form/Inputs/Label";
import Button from "@components/Form/Buttons/Button";
import { FileType } from "@src/graphql/graphql";
import createFile from "@src/graphql/mutations/createFile";

interface props extends preMadeDialogNeeded {
  folderId: string;
}

export default function CreateFileDialog({ isOpen, onClose, folderId }: props) {
  const nameInput = useRef<HTMLDivElement>(null);
  const [name, setName] = useState<string>("");

  const typeSelect = useRef<HTMLSelectElement>(null);
  const [type, setType] = useState<FileType>(FileType.Document);

  const errorClasses = `ring-2 ring-red-500`;

  useEffect(() => {
    if (name === "") {
      const div = nameInput.current;
      if (div) {
        const classes = div.className;
        if (classes.indexOf(errorClasses) === -1) {
          div.className = `${classes} ${errorClasses}`;
        }
      }
    } else {
      /*
       * const div = nameInput.current;
       *
       * ERROR: "const div" doesn't exist
       */
      const div = nameInput.current;
      if (div) {
        const classes = div.className;
        console.log(classes);
        if (classes.indexOf(errorClasses) !== -1) {
          div.className = classes.replace(errorClasses, "");
        }
      }
    }
  }, [name]);

  async function submitHandler(e: FormEvent) {
    e.preventDefault();

    if (name === "") {
      const oldClasses = nameInput.current?.className;
      nameInput.current!.className = `${oldClasses} ${errorClasses}`;
      return;
    }

    /* try { */
    const { data, error } = await createFile({
      name: name,
      fileType: type,
      folder_id: folderId,
    });

    if (data) {
      onClose();
    }
    if (error) {
      new Error(error);
    }
    /* } catch (error) {
      console.log(error);
    } */
  }

  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <form onSubmit={submitHandler} className={`space-y-2`} method="POST">
          <Stack type="col">
            <Label text="Nome" htmlFor={`fileName`} />
            <Input
              input={{
                type: "text",
                name: "fileName",
                onChange: (e) => {
                  setName(e.target.value);
                },
                value: name,
              }}
              mainDiv={{
                ref: nameInput,
              }}
            />
          </Stack>
          <Stack type="col">
            <Label text="Tipo de Ficheiro" htmlFor={`fileType`} />
            <select
              onChange={(e) => {
                setType(e.target.value as FileType);
              }}
              value={type}
              name={`fileType`}
              ref={typeSelect}
            >
              {Object.keys(FileType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Stack>
          <Button type="submit">Teste</Button>
        </form>
      </PreMadeDialog>
    </>
  );
}
