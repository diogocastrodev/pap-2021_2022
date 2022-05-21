import Stack from "@components/Form/Stack/Stack";
import Form from "@components/Form/Form/Form";
import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";
import { gql } from "graphql-request";
import { gqlClient } from "@libs/graphql-request";
import Button from "@components/Form/Buttons/Button";
import { FormEvent } from "react";

const deleteFileMutation = gql`
  mutation deleteFile($fileId: ID!) {
    deleteFile(fileId: $fileId)
  }
`;

interface props extends preMadeDialogNeeded {
  id?: string;
  onDelete: () => void;
}

export default function DeleteFileDialog(props: props) {
  async function onSubmitHandler(e: FormEvent) {
    e.preventDefault();
    await gqlClient
      .request(deleteFileMutation, { fileId: props.id })
      .then((res) => {
        if (res.deleteFile) {
          props.onClose();
          props.onDelete();
        }
      })
      .catch((err) => {});
  }

  return (
    <>
      <PreMadeDialog {...props}>
        <Form onSubmit={onSubmitHandler}>
          <Stack type="col">
            <Stack type="col">
              <span className="text-xl">
                Tem acerteza que deseja apagar este ficheiro?
              </span>
              <span className="text-black text-opacity-70">
                Apartir do momento que apagar este ficheiro, irá perder acesso a
                qualquer tipo de acesso ao ficheiro, qualquer apontamento ou
                documento irá ser apagado.
              </span>
            </Stack>
            <Button type="submit" color="red" className="mt-3">
              Apagar ficheiro
            </Button>
          </Stack>
        </Form>
      </PreMadeDialog>
    </>
  );
}
