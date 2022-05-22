import { Menu } from "@headlessui/react";
import {
  CheckIcon,
  DotsHorizontalIcon,
  FolderIcon,
} from "@heroicons/react/solid";
import {
  CalendarIcon,
  CloudDownloadIcon,
  FolderAddIcon,
  FolderOpenIcon,
} from "@heroicons/react/outline";
import { useEffect, useState, useContext, MouseEvent, ReactChild } from "react";
import Loader from "../Loader/Loader";
import Item from "./Item/Item";
import LargeItem from "./LargeItem/Largeitem";
import TinyItem from "./TinyItem/TinyItem";
import { useRouter } from "next/router";
import TreeNode from "../Tree/TreeNode";
import DashboardListFiles from "./Folders/Page/ListFiles";
import { FoldersContext } from "@src/context/FoldersContext";
import LastUpdateTimeFolders from "./LastUpdateTime/LastUpdateTime";
import FoldersContextMenu from "./Folders/ContextMenu/FoldersContextMenu";
import SearchDialog from "./Search/SearchDialog";
import CreateFolderDialog from "./Folders/Create Folder/CreateFolder";
import ItemsToPage from "./Items/Items";
import Head from "next/head";
import NeedLogin from "../Login/NeedLogin";
import Link from "next/link";
import DeleteFileDialog from "./Files/DeleteFile/DeleteFile";
import OrganizeFolderDialog from "./Folders/Organize Folders/OrganizeFolder";

interface props {
  folder?: {
    id: string;
  };
  item?: {
    id: string;
  };
  children?: React.ReactNode | React.ReactNode[];
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

  const [ShowLastUpdateTime, setShowLastUpdateTime] = useState(false);
  const [LastUpdateTimePos, setLastUpdateTimePos] = useState({
    x: 0,
    y: 0,
  });

  const [OpenContextMenu, setOpenContextMenu] = useState(false);
  const [ContextMenuPos, setContextMenuPos] = useState({
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

  const [folderFocused, setFolderFocused] = useState<string>("");

  const [folderSelected, setFolderSelected] = useState<string | undefined>(
    props.folder?.id
  );

  useEffect(() => {
    if (props.folder) {
      setFolderSelected(props.folder.id);
    }
  }, [props.folder?.id]);

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
      <Head>
        <title>Dashboard | note.so</title>
      </Head>
      <SearchDialog />
      <FoldersContextMenu
        folder={folderFocused}
        isOpen={OpenContextMenu}
        onClose={() => setOpenContextMenu(false)}
        pos={ContextMenuPos}
      />
      <LastUpdateTimeFolders
        isOpen={ShowLastUpdateTime}
        onClose={() => {
          setShowLastUpdateTime(false);
        }}
        pos={LastUpdateTimePos}
      />
      {dialogType === "organize" && dialogOpen && (
        <OrganizeFolderDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
      {dialogType === "create" && dialogOpen && (
        <CreateFolderDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}

      {/* Menu */}
      <NeedLogin>
        <div className="w-full max-h-[calc(100vh-4rem)] flex flex-row gap-x-2 relative">
          <TinyItem className="min-w-[16rem]">
            <Item>
              <div className="w-full flex h-full flex-col pt-2 px-2">
                <div className="mb-4 mt-2">
                  <div className="w-full flex items-center cursor-pointer">
                    <Link href={`/dashboard/calendar`}>
                      <div className="flex items-center">
                        <CalendarIcon className="w-5" />
                        <span className="ml-2">Calendario</span>
                      </div>
                    </Link>
                  </div>
                  <div className="w-full flex items-center cursor-pointer">
                    <Link href={`/dashboard/todos`}>
                      <div className="flex items-center">
                        <CheckIcon className="w-5" />
                        <span className="ml-2">Apontamentos</span>
                      </div>
                    </Link>
                  </div>
                </div>
                {/* Folders Section */}
                <div className="w-full flex  items-center">
                  {/* Icon */}
                  <FolderIcon className="w-5" />
                  {/* Section Title */}
                  <div className="ml-2 flex items-center">
                    Pastas
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
                          "fixed z-[99] top-40 left-30 py-3 px-2 min-w bg-gray-200 rounded-md shadow-md select-none focus:outline-none space-y-1"
                        }
                      >
                        {foldersThreeDotOptions.map((item, i: number) => (
                          <Menu.Item key={i}>
                            {/* @ts-ignore */}
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
                  className="h-full mb-2 overflow-y-auto folders-scroll pr-1"
                  id="folders-scroll"
                >
                  {/* Folder Loader */}
                  {folders.folderData.loading && (
                    <Loader size="medium" className="mx-auto mt-8" />
                  )}
                  {/* Show Folders Tree */}
                  {!folders.folderData.loading && folders.folderData.folders && (
                    <TreeNode
                      folders={folders.folderData.folders}
                      showFiles={true}
                      onContext={(id: string) => {
                        setFolderFocused(id);
                      }}
                    />
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
            <LargeItem className="">
              <Item className="p-2">
                <DashboardListFiles folderId={folderSelected} />
              </Item>
            </LargeItem>
          )}
          {/* Item Area */}
          {itemSelected && (
            <LargeItem className="">
              <Item className="p-2 overflow-y-auto overflow-hidden">
                <ItemsToPage id={itemSelected} />
              </Item>
            </LargeItem>
          )}
          {props.children && (
            <LargeItem className="">
              <Item className="p-2 overflow-y-auto overflow-hidden">
                {props.children as ReactChild[]}
              </Item>
            </LargeItem>
          )}
        </div>
      </NeedLogin>
    </>
  );
}
