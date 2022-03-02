import { gql, useQuery } from "@apollo/client";
import { Menu, Dialog } from "@headlessui/react";
import {
  CheckIcon,
  DotsHorizontalIcon,
  FolderIcon,
} from "@heroicons/react/solid";
import {
  BookOpenIcon,
  CalendarIcon,
  FolderAddIcon,
  FolderOpenIcon,
} from "@heroicons/react/outline";
import { folderChildrenFragment } from "@src/graphql/fragments";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Tree from "../Tree/Tree";
import CreateFolder from "./Folders/Create Folder/CreateFolder";
import Item from "./Item/Item";
import LargeItem from "./LargeItem/Largeitem";
import TinyItem from "./TinyItem/TinyItem";
import OrganizeFolder from "./Folders/Organize Folders/OrganizeFolder";

const getFolders = gql`
  ${folderChildrenFragment}
  query userFolders {
    userFolders {
      folders {
        ...children
      }
      folders_amount
    }
  }
`;

interface props {
  item?: {
    id: string;
  };
}

type dialogTypes = "create" | "organize";

type FolderThreeDotType = {
  name: string;
  icon: React.ReactElement;
  onClick?: () => void;
  type: dialogTypes;
}[];

const foldersThreeDotOptions: FolderThreeDotType = [
  {
    name: "Adicionar",
    icon: <FolderAddIcon className="w-5" />,
    type: "create",
  },
  {
    name: "Organizar",
    icon: <FolderOpenIcon className="w-5" />,
    type: "organize",
  },
];

export default function DashboardPage(props: props) {
  const { data, loading, error } = useQuery(getFolders);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<dialogTypes>("create");

  return (
    <>
      <Dialog
        as="div"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        className="fixed inset-0 overflow-y-auto z-[999]"
      >
        <Dialog.Overlay
          className={"fixed inset-0 bg-gray-700 bg-opacity-20 z-[999]"}
        />
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="bg-white w-2/3 z-[1000] px-8 py-4 rounded-lg min-h-min flex flex-col">
            {dialogType === "create" && (
              <CreateFolder folders={data?.userFolders.folders} />
            )}
            {dialogType === "organize" && <OrganizeFolder />}
          </div>
        </div>
      </Dialog>
      <div className="flex flex-1 ">
        <TinyItem className="mx-1 basis-1/5">
          <Item>
            <div className="w-full flex flex-col pt-2 px-2">
              <div className="mb-4 mt-2">
                <div className="w-full flex items-center cursor-not-allowed">
                  <CalendarIcon className="w-5" />
                  <span className="ml-2">Calendario</span>
                </div>
                <div className="w-full flex items-center cursor-not-allowed">
                  <CheckIcon className="w-5" />
                  <span className="ml-2">Apontamentos</span>
                </div>
                <div className="w-full flex items-center cursor-not-allowed">
                  <BookOpenIcon className="w-5" />
                  <span className="ml-2">Diário</span>
                </div>
              </div>
              <div className="w-full flex items-center">
                <FolderIcon className="w-5" />
                <span className="ml-2">Folders</span>
                <div className="ml-auto">
                  <Menu as="div" className={"relative"}>
                    <Menu.Button className={"flex items-center"} as="div">
                      <DotsHorizontalIcon className="w-5 cursor-pointer" />
                    </Menu.Button>
                    <Menu.Items
                      className={
                        "absolute top-6 -left-12 py-3 px-2 min-w bg-gray-200 rounded-md shadow-md select-none focus:outline-none space-y-1"
                      }
                    >
                      {foldersThreeDotOptions.map((item, i: number) => (
                        <Menu.Item key={i}>
                          {({ active }) => (
                            <div
                              className={`${
                                active && "bg-blue-200"
                              } px-2 py-1 rounded-lg flex items-center cursor-pointer`}
                              onClick={() => {
                                setDialogType(item.type);
                                setDialogOpen(true);
                              }}
                            >
                              {item.icon}
                              <span className="ml-1">{item.name}</span>
                            </div>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
              {loading && <Loader size="medium" className="mx-auto mt-8" />}
              {!loading && data && <Tree folders={data.userFolders.folders} />}
            </div>
          </Item>
        </TinyItem>
        {/* <TinyItem className="mx-1 basis-1/5">
          <Item>
            <div></div>
          </Item>
        </TinyItem> */}
        <LargeItem className="mx-1 basis-4/5">
          <Item>
            <div></div>
          </Item>
        </LargeItem>
      </div>
    </>
  );
}
