import { gql } from "@apollo/client";
import { PencilIcon, XIcon } from "@heroicons/react/solid";
import Label from "@src/components/Form/Inputs/Label";
import { folderFragment } from "@src/graphql/fragments";
import { ExportedData } from "@src/graphql/graphql";
import { useContext, useState } from "react";
import Input from "@components/Form/Inputs/Input";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Stack from "@components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
import Form from "@components/Form/Form/Form";
import TreeNode from "@src/components/Tree/TreeNode";
import { gqlClient } from "@libs/graphql-request";
import { FoldersContext } from "@src/context/FoldersContext";
import AntiFocusTrap from "../../../AntiFocusTrap/AntiFocusTrap";
import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";

interface props extends preMadeDialogNeeded {}

const createFolderMutation = gql`
  ${folderFragment}

  mutation ($name: String!, $parent_id: ID, $color: String) {
    createFolder(name: $name, parent_id: $parent_id, color: $color) {
      ...folderData
    }
  }
`;

interface ILastClicked {
  folder_id: string;
  name: string;
}

export default function CreateFolderDialog(props: props) {
  const { refreshFolders, folderData } = useContext(FoldersContext);

  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [LastClicked, setLastClicked] = useState<ILastClicked>();
  const [error, setError] = useState<"empty name" | undefined>(undefined);

  const lastClickedFolder = (id: string, name: string) => {
    setLastClicked({
      folder_id: id,
      name: name,
    });
  };

  const createFolderFunction = async () => {
    gqlClient
      .request(createFolderMutation, {
        name,
        parent_id: LastClicked?.folder_id,
        color,
      })
      .then(() => {
        setName("");
        setColor("");
        refreshFolders();
        props.onClose();
      })
      .catch((err) => {
        if (err.message.includes("name") && err.message.includes("empty")) {
          setError("empty name");
        }
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
            <span className="text-justify">Clique no Parente</span>
            <div className="flex flex-1 w-full bg-gray-200 rounded-md mr-4 py-1 overflow-hidden overflow-y-auto">
              <TreeNode
                folders={folderData.folders as ExportedData[]}
                onClick={lastClickedFolder}
                showFiles={false}
                redirectFolder={false}
              />
            </div>
          </div>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              createFolderFunction();
            }}
            className="w-full"
          >
            <Stack type="col" className="">
              <Stack type="col">
                <InputGroup>
                  <Label text="Nome" required={true} />
                  <Input
                    input={{
                      type: "text",
                      onChange: (e) => setName(e.target.value),
                      value: name,
                      required: true,
                    }}
                    mainDiv={{
                      className: `${
                        error === "empty name" ? "ring-red-400 ring-2" : ""
                      }`,
                    }}
                  />
                </InputGroup>
                <InputGroup>
                  <Label text="Parente" />
                  <Input
                    input={{
                      type: "text",
                      value: LastClicked ? LastClicked.name : "Raiz das pastas",
                      disabled: true,
                    }}
                    button={{
                      icon: <XIcon />,
                      type: "button",
                      otherProps: {
                        onClick: () => {
                          setLastClicked(undefined);
                        },
                      },
                    }}
                  />
                </InputGroup>
              </Stack>
              <Stack type="col" className="">
                <InputGroup>
                  <Label text="Cor" />
                  <Input
                    input={{
                      type: "color",
                      onChange: (e) => setColor(e.target.value),
                    }}
                  />
                </InputGroup>
              </Stack>
              <Button
                type="submit"
                color="blue"
                icon={{
                  icon: <PencilIcon />,
                  position: "left",
                }}
                className="mt-4 "
              >
                Criar Pasta
              </Button>
            </Stack>
            {error !== undefined && (
              <div className="text-red-400 text-md mt-2">
                {error === "empty name" && "O Nome da pasta não pode ser vazio"}
              </div>
            )}
          </Form>
        </div>
      </PreMadeDialog>
    </>
  );
}
