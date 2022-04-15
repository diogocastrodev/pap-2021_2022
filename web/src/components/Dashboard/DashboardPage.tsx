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
  CloudDownloadIcon,
  CogIcon,
  FolderAddIcon,
  FolderOpenIcon,
} from "@heroicons/react/outline";
import { folderChildrenFragment } from "@src/graphql/fragments";
import { useEffect, useState, useContext, MouseEvent } from "react";
import Loader from "../Loader/Loader";
import CreateFolder from "./Folders/Create Folder/CreateFolder";
import Item from "./Item/Item";
import LargeItem from "./LargeItem/Largeitem";
import TinyItem from "./TinyItem/TinyItem";
import OrganizeFolder from "./Folders/Organize Folders/OrganizeFolder";
import { AuthContext } from "@src/context/AuthContext";
import { useRouter } from "next/router";
import TreeNode from "../Tree/TreeNode";
import DashboardListFiles from "./Folders/Page/ListFiles";
import { FoldersContext, FoldersProvider } from "@src/context/FoldersContext";
import moment from "moment";
import ItemsToPage from "./Items/Items";
import LastUpdateTimeFolders from "./LastUpdateTime/LastUpdateTime";

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
  folder?: {
    id: string;
  };
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
  const router = useRouter();
  const folders = useContext(FoldersContext);

  /* const user = useContext(AuthContext);
  if (user.AuthData.loading) return <Loader size="medium" />;
  if (!user.AuthData.loading) {
    if (!user.AuthData.is_logged || !user.AuthData.user) {
      routes.redirect("/auth/login");
    }
  }
  useEffect(() => {
    if (!user.AuthData.loading) {
      if (!user.AuthData.is_logged || !user.AuthData.user) {
        routes.redirect("/auth/login");
      }
    }
  }, [user.AuthData.loading]); */

  const [ShowLastUpdateTime, setShowLastUpdateTime] = useState(false);
  const [LastUpdateTimePos, setLastUpdateTimePos] = useState({
    x: 0,
    y: 0,
  });
  const [DateTime, setDateTime] = useState<number>(new Date().getTime());

  const [itemSelected, setItemSelected] = useState<string | undefined>(
    props.item?.id
  );

  useEffect(() => {
    if (props.item) {
      setItemSelected(props.item.id);
    }
  }, [props.item?.id]);

  const [folderSelected, setFolderSelected] = useState<string | undefined>(
    props.folder?.id
  );

  useEffect(() => {
    if (props.folder) {
      setFolderSelected(props.folder.id);
    }
  }, [props.folder?.id]);

  const { data, loading, error } = useQuery(getFolders);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<dialogTypes>("create");

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LastUpdateTimeFolders
        isOpen={ShowLastUpdateTime}
        onClose={() => {
          setShowLastUpdateTime(false);
        }}
        pos={LastUpdateTimePos}
      />
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

      {/* Menu */}
      <div className="flex flex-1 ">
        <TinyItem className="flex-none mx-1 basis-1/5">
          <Item
            extra={{
              onContextMenu: (e: MouseEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
              },
            }}
          >
            <div className="w-full flex flex-1 h-full flex-col pt-2 px-2">
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
              {/* Folders Section */}
              <div className="w-full flex  items-center">
                {/* Icon */}
                <FolderIcon className="w-5" />
                {/* Section Title */}
                <div className="ml-2 flex items-center">
                  Folders
                  <div
                    className="ml-1"
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLastUpdateTimePos({
                        x: e.clientX,
                        y: e.clientY,
                      });
                      setShowLastUpdateTime(true);
                    }}
                    onMouseLeave={() => setShowLastUpdateTime(false)}
                    onClick={folders.refreshFolders}
                  >
                    <CloudDownloadIcon
                      className={`h-5 w-5 ${
                        folders.folderData.lastUpdate.getTime() + 20 * 1000 <=
                        DateTime
                          ? `text-black text-opacity-40`
                          : `text-blue-600 text-opacity-90`
                      } text-opacity-40 cursor-pointer`}
                    />
                  </div>
                </div>
                {/* 3 Dot Menu */}
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
              {/* Folders Wrapper */}
              <div
                className="h-full mb-2"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Full");
                }}
              >
                {/* Folder Loader */}
                {folders.folderData.loading && (
                  <Loader size="medium" className="mx-auto mt-8" />
                )}
                {/* Show Folders Tree */}
                {!folders.folderData.loading && folders.folderData.folders && (
                  <TreeNode folder={folders.folderData.folders} />
                )}
              </div>
            </div>
          </Item>
        </TinyItem>
        {/* <TinyItem className="mx-1 basis-1/5">
          <Item>
            <div></div>
          </Item>
        </TinyItem> */}
        {/* Folder Area */}
        {folderSelected && (
          <LargeItem className="mx-1 basis-auto shrink">
            <Item className="p-2">
              <DashboardListFiles folderId={folderSelected} />
            </Item>
          </LargeItem>
        )}
        {/* Item Area */}
        {itemSelected && (
          <LargeItem className="mx-1 basis-auto shrink">
            <Item className="p-2">
              <ItemsToPage id={itemSelected} />
            </Item>
          </LargeItem>
        )}
      </div>
    </>
  );
}
