import { preMadeDialogNeeded } from "@components/Dialog/PreMadeDialog";
import PreMadeDialog from "@components/Dialog/PreMadeDialog";
import { useContext, useEffect, useState } from "react";
import { Folders } from "@src/graphql/graphql";
import { FoldersContext } from "@src/context/FoldersContext";
import Stack from "@src/components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
import { gqlClient } from "@libs/graphql-request";
import { gql } from "graphql-request";
import { useRouter } from "next/router";

interface props extends preMadeDialogNeeded {
  folderId: string;
}

const deleteFolderMutation = gql`
  mutation deleteFolder($folderId: ID!) {
    deleteFolder(folderId: $folderId)
  }
`;

export default function DeleteFolderDialog({
  isOpen,
  onClose,
  folderId,
}: props) {
  const router = useRouter();
  const { folderData, refreshFolders } = useContext(FoldersContext);
  const [Folder, setFolder] = useState<Folders>();

  async function deleteHandler() {
    gqlClient
      .request(deleteFolderMutation, {
        folderId,
      })
      .then((res) => {
        if (res.deleteFolder) {
          if (router.pathname.includes("/f")) {
            router.push("/dashboard/");
          }
          refreshFolders();
          onClose();
        }
      })
      .catch((err) => {});
  }

  useEffect(() => {
    setFolder(undefined);

    folderData.straightFolders?.forEach((folder) => {
      if (folder.folder_id === folderId) {
        setFolder(folder as Folders);
      }
    });
  }, [folderId]);

  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <Stack type="col" className="space-y-2">
          <div className="font-bold text-xl">
            Deseja apagar a pasta{" "}
            <span className="font-normal">{Folder?.name}</span> ?
          </div>
          <div className="text-gray-600">
            Ao apagar a pasta, todos os arquivos e pastas que estão dentro dela
            serão apagados também.
          </div>
          <Button color="red" onClick={deleteHandler}>
            Apagar pasta
          </Button>
        </Stack>
      </PreMadeDialog>
    </>
  );
}
