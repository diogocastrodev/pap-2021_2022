import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";
import { FoldersContext } from "@src/context/FoldersContext";
import { Files } from "@src/graphql/graphql";
import { FormEvent, useContext, useEffect, useState } from "react";
import Stack from "@components/Form/Stack/Stack";
import Form from "@components/Form/Form/Form";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Label from "@components/Form/Inputs/Label";
import Input from "@components/Form/Inputs/Input";
import Button from "@components/Form/Buttons/Button";
import { gql } from "graphql-request";
import { gqlClient } from "@libs/graphql-request";

interface props extends preMadeDialogNeeded {
  id?: string | undefined;
  onUpdate: () => void;
}

const updateFileMutation = gql`
  mutation updateFile($fileId: ID!, $name: String!) {
    updateFile(fileId: $fileId, name: $name)
  }
`;

export default function UpdateFileDialog({
  isOpen,
  onClose,
  id,
  onUpdate,
}: props) {
  const { folderData } = useContext(FoldersContext);

  const [file, setFile] = useState<Files | undefined>();

  async function formHandler(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    const { name } = file;
    if (name === "") return;
    await gqlClient
      .request(updateFileMutation, {
        fileId: id,
        name,
      })
      .then((res) => {
        if (res.updateFile) {
          onUpdate();
          onClose();
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    setFile(undefined);
    if (id) {
      const file = folderData.straightFolders?.find((folder) => {
        return folder.files?.find((file) => file?.file_id === id);
      });

      if (file && file.files && file.files.length > 0) {
        setFile(file.files[0] as Files);
      }
    }
  }, [id]);

  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <Stack type="col">
          <div className="">Atualizar Ficheiro</div>
          <Form onSubmit={formHandler}>
            <InputGroup>
              <Label text="Nome"></Label>
              <Input
                input={{
                  type: "text",
                  value: file?.name,
                  onChange: (e) => {
                    if (file) {
                      setFile({ ...file, name: e.target.value });
                    }
                  },
                }}
              ></Input>
            </InputGroup>
            <Button>Atualizar ficheiro</Button>
          </Form>
        </Stack>
      </PreMadeDialog>
    </>
  );
}
