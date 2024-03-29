import { preMadeDialogNeeded } from "@components/Dialog/PreMadeDialog";
import PreMadeDialog from "@components/Dialog/PreMadeDialog";
import { FoldersContext } from "@src/context/FoldersContext";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Folders } from "@src/graphql/graphql";
import Stack from "@src/components/Form/Stack/Stack";
import Form from "@components/Form/Form/Form";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Label from "@components/Form/Inputs/Label";
import Input from "@components/Form/Inputs/Input";
import Button from "@components/Form/Buttons/Button";
import { gql } from "graphql-request";
import { gqlClient } from "@libs/graphql-request";
interface props extends preMadeDialogNeeded {
  folderId: string;
}

const updateMutation = gql`
  mutation updateFolder($folderId: ID!, $name: String, $color: String) {
    updateFolder(folderId: $folderId, name: $name, color: $color)
  }
`;

export default function UpdateFolderDialog({
  isOpen,
  onClose,
  folderId,
}: props) {
  const { folderData, refreshFolders } = useContext(FoldersContext);

  const [Folder, setFolder] = useState<Folders>();

  async function formHandler(e: FormEvent) {
    e.preventDefault();
    gqlClient
      .request(updateMutation, {
        folderId: Folder?.folder_id,
        name: Folder?.name,
        color: Folder?.color,
      })
      .then((res) => {
        if (res.updateFolder) {
          refreshFolders();
          onClose();
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    setFolder(undefined);
    if (folderData) {
      folderData.straightFolders?.forEach((folder) => {
        if (folder.folder_id === folderId) {
          setFolder(folder as Folders);
        }
      });
    }
  }, [folderId]);

  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <Stack type="col">
          <div className="font-semibold text-2xl mb-3">Atualizar Pasta</div>
          <Form onSubmit={formHandler}>
            <Stack type="col" className="space-y-2">
              <InputGroup>
                <Label text="Nome"></Label>
                <Input
                  input={{
                    type: "text",
                    value: Folder?.name,
                    onChange: (e) => {
                      if (Folder) {
                        setFolder({
                          ...Folder,
                          name: e.target.value,
                        });
                      }
                    },
                  }}
                ></Input>
              </InputGroup>
              <InputGroup>
                <Label text="Cor"></Label>
                <Input
                  input={{
                    type: "color",
                    value: Folder?.color,
                    onChange: (e) => {
                      if (Folder) {
                        setFolder({
                          ...Folder,
                          color: e.target.value,
                        });
                      }
                    },
                  }}
                ></Input>
              </InputGroup>
              <Button>Atualizar</Button>
            </Stack>
          </Form>
        </Stack>
      </PreMadeDialog>
    </>
  );
}
