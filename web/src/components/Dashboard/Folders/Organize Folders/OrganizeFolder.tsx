import { preMadeDialogNeeded } from "@components/Dialog/PreMadeDialog";
import PreMadeDialog from "@components/Dialog/PreMadeDialog";
import AntiFocusTrap from "@components/AntiFocusTrap/AntiFocusTrap";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import TreeNode from "@src/components/Tree/TreeNode";
import { FoldersContext } from "@src/context/FoldersContext";
import { ExportedData } from "@src/graphql/graphql";
import Button from "@components/Form/Buttons/Button";
import { gqlClient } from "@libs/graphql-request";
import { gql } from "graphql-request";

interface props extends preMadeDialogNeeded {}

interface states {
  folder_id: string;
  name: string;
}

const moveFolderMutation = gql`
  mutation moveFolder($folderId: ID!, $parent_id: ID, $remParent: Boolean) {
    moveFolder(
      folderId: $folderId
      parent_id: $parent_id
      remParent: $remParent
    )
  }
`;

export default function OrganizeFolderDialog(props: props) {
  const { folderData, refreshFolders } = useContext(FoldersContext);

  const [From, setFrom] = useState<states | undefined>();
  const [To, setTo] = useState<states | undefined>();

  async function submitHandler() {
    if (From && From.folder_id !== To?.folder_id) {
      const { folder_id: from } = From;

      let vars = {};

      vars = {
        ...vars,
        folderId: from,
      };

      if (To) {
        const { folder_id: to } = To;
        vars = {
          ...vars,
          parent_id: to,
        };
      } else {
        vars = {
          ...vars,
          remParent: true,
        };
      }

      await gqlClient
        .request(moveFolderMutation, vars)
        .then((res) => {
          if (res.moveFolder) {
            refreshFolders();
            props.onClose();
          }
        })
        .catch((err) => {});
    }
  }

  const lastClickedFolder = (
    state: Dispatch<SetStateAction<states | undefined>>,
    id: string,
    name: string
  ) => {
    state({
      folder_id: id,
      name: name,
    });
  };

  return (
    <>
      <PreMadeDialog isOpen={props.isOpen} onClose={props.onClose}>
        <AntiFocusTrap
          pos={{
            x: -20,
            y: -20,
          }}
        ></AntiFocusTrap>
        <div className="flex flex-row max-h-120 ">
          <div className="flex flex-col w-1/3 mr-4 ">
            <span className="text-justify">Origem:</span>
            <div className="flex flex-1 w-full bg-gray-200 rounded-md mr-4 py-1 overflow-hidden overflow-y-auto">
              <TreeNode
                folders={folderData.folders as ExportedData[]}
                onClick={(id, name) => {
                  lastClickedFolder(setFrom, id, name);
                }}
                showFiles={false}
                redirectFolder={false}
              />
            </div>
            <div className="flex justify-center">
              <div
                onClick={() => {
                  setFrom(undefined);
                }}
                className="cursor-pointer"
              >
                Raiz
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/3 mr-4 ">
            <span className="text-justify">Destino:</span>
            <div className="flex flex-1 w-full bg-gray-200 rounded-md mr-4 py-1 overflow-hidden overflow-y-auto">
              <TreeNode
                folders={folderData.folders as ExportedData[]}
                onClick={(id, name) => {
                  lastClickedFolder(setTo, id, name);
                }}
                showFiles={false}
                redirectFolder={false}
              />
            </div>
            <div className="flex justify-center">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setTo(undefined);
                }}
              >
                Raiz
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/3 mr-4 ">
            <span className="text-justify text-xl font-medium">
              Confirme os dados:
            </span>
            <div>
              <div className="flex ">
                <div className="font-medium mr-1">Pasta de origem:</div>
                <div className="overflow-hidden text-ellipsis">
                  {From?.name}
                </div>
              </div>
              <div className="flex ">
                <div className="font-medium mr-1">Pasta de destino:</div>
                <div className="overflow-hidden text-ellipsis">{To?.name}</div>
              </div>
            </div>
            <Button
              className="mt-3"
              disabled={!To || !From || To.folder_id === From.folder_id}
              onClick={submitHandler}
            >
              Mover
            </Button>
            {To && From && To?.folder_id === From?.folder_id && (
              <div className="text-red-500 text-xs italic">
                Pasta de origem e destino são iguais
              </div>
            )}
          </div>
        </div>
      </PreMadeDialog>
    </>
  );
}
