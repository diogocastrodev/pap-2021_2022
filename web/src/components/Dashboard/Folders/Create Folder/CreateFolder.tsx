import { gql, useMutation } from "@apollo/client";
import { PencilIcon, XIcon } from "@heroicons/react/solid";
import Label from "@src/components/Form/Inputs/Label";
import { routes } from "@src/functions/routes";
import { folderFragment } from "@src/graphql/fragments";
import { ColorStyle, ExportedData } from "@src/graphql/graphql";
import { useState } from "react";
import Input from "@components/Form/Inputs/Input";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Stack from "@components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
import Form from "@components/Form/Form/Form";
import Tree from "@components/Tree/Tree";
import TreeNode from "@src/components/Tree/TreeNode";

interface props {
  folders: ExportedData[];
}

const createFolderMutation = gql`
  ${folderFragment}

  mutation ($data: createFolderInput!) {
    createFolder(data: $data) {
      ...folderData
    }
  }
`;

interface ILastClicked {
  folder_id: string;
  name: string;
}

export default function CreateFolder(props: props) {
  const [createFolder] = useMutation(createFolderMutation);

  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [colorStyle, setColorStyle] = useState<ColorStyle>(ColorStyle.Rgb);
  const [LastClicked, setLastClicked] = useState<ILastClicked>();
  const [error, setError] = useState<"empty name" | undefined>(undefined);

  const lastClickedFolder = (id: string, name: string) => {
    setLastClicked({
      folder_id: id,
      name: name,
    });
  };

  const createFolderFunction = async () => {
    createFolder({
      variables: {
        data: {
          name,
          parent_id: LastClicked?.folder_id,
          color,
          color_style: colorStyle,
        },
      },
    })
      .then(() => {
        routes.reload();
      })
      .catch((err) => {
        if (err.message.includes("name") && err.message.includes("empty")) {
          setError("empty name");
        }
      });
  };

  return (
    <>
      <div className="flex flex-row max-h-120 ">
        <div className="flex flex-col w-1/4 mr-4 ">
          <span className="text-justify">
            Clique na pasta no qual deseja adicionar
          </span>
          <div className="flex flex-1 w-full bg-gray-200 rounded-md mr-4 py-1">
            <TreeNode folder={props.folders} onClick={lastClickedFolder} />
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
                <Label text="Folder Name" required={true} />
                <Input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  mainDiv={{
                    className: `${
                      error === "empty name" ? "ring-red-400 ring-2" : ""
                    }`,
                  }}
                  required={true}
                />
              </InputGroup>
              <InputGroup>
                <Label text="Folder Parent" />
                <Input
                  type="text"
                  value={LastClicked ? LastClicked.name : "Raiz das pastas"}
                  disabled={true}
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
                <Label text="Color" />
                <Input
                  type="color"
                  onChange={(e) => setColor(e.target.value)}
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
    </>
  );
}
