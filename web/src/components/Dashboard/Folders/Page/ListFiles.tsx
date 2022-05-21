import Stack from "@src/components/Form/Stack/Stack";
import Loader from "@src/components/Loader/Loader";
import { FoldersContext } from "@src/context/FoldersContext";
import { Files, FileType, Folders } from "@src/graphql/graphql";
import { useContext, useEffect, useState } from "react";
import Button from "../../../Form/Buttons/Button";
import CreateFileDialog from "../../Files/Create File/CreateFile";
import Input from "@components/Form/Inputs/Input";
import { Listbox, Menu } from "@headlessui/react";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { CogIcon, BanIcon } from "@heroicons/react/outline";
import UpdateFolderDialog from "../UpdateFolder/UpdateFolderDialog";
import DeleteFolderDialog from "../DeleteFolder/DeleteFolder";

interface props {
  folderId: string;
}

export default function DashboardListFiles({ folderId }: props) {
  const { folderData } = useContext(FoldersContext);

  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const [childrenFolders, setChildrenFolders] = useState<Folders[]>([]);
  const [fileList, setFileList] = useState<Files[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                                   Dialog                                   */
  /* -------------------------------------------------------------------------- */

  const [updateFolderOpen, setUpdateFolderOpen] = useState(false);
  const [updateFolderId, setUpdateFolderId] = useState<string | undefined>(
    undefined
  );
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<string | undefined>(
    undefined
  );

  const [updateFileOpen, setUpdateFileOpen] = useState(false);
  const [updateFileId, setUpdateFileId] = useState<string | undefined>(
    undefined
  );
  const [deleteFileOpen, setDeleteFileOpen] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState<string | undefined>(
    undefined
  );

  const [loading, setLoading] = useState(true);

  const filterFolderData = (id: string) => {
    const selectedFolder = folderData.straightFolders?.filter(
      (folder) => folder.folder_id === id
    )[0];
    return selectedFolder;
  };

  const updateVars = () => {
    setChildrenFolders([]);
    setFileList([]);
    setParentId(undefined);
    const folder = filterFolderData(folderId);
    if (folder) {
      if (folder.parent_id && folder.parent_id !== "")
        setParentId(folder.parent_id);
      setChildrenFolders(folder.children as unknown as Folders[]);
      setFileList(folder.files as Files[]);
    }
  };

  function sortAscending(arr: any[]) {
    // To avoid mutating the original array, make a deep copy
    const arrToSort = Array.from(arr);

    return arrToSort.sort(
      ([a, b], [c, d]) => a.localeCompare(c) || b.localeCompare(d)
    );
  }

  enum SearchType {
    Recent = "Mais Recente",
    Older = "Mais Antigo",
  }

  enum TypeOfFile {
    All = "Todos",
    Document = "Documentos",
    Todo = "Apontamentos",
  }

  const [FileSearch, setFileSearch] = useState<string>("");
  const [FileSearchType, setFileSearchType] = useState<SearchType>(
    SearchType.Recent
  );
  const [FileSearchTypeOfFile, setFileSearchTypeOfFile] = useState<TypeOfFile>(
    TypeOfFile.All
  );

  const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] =
    useState<boolean>(false);

  const onCloseCreateFileDialog = () => {
    setIsCreateFileDialogOpen(false);
  };

  const getFileListBySearch = (): Files[] => {
    if (fileList.length > 0) {
      let list = fileList.filter((it) => {
        return (
          it.name.toLowerCase().includes(FileSearch.toLowerCase()) ||
          FileSearch.toLowerCase().trim() === "" ||
          FileSearch.toLowerCase().trim() === " "
        );
      });

      switch (FileSearchType) {
        case SearchType.Recent:
          list = list.sort(function (a, b) {
            return a.created_at - b.created_at;
          });

          break;
        case SearchType.Older:
          list = list.sort(function (a, b) {
            return b.created_at - a.created_at;
          });

          break;
      }
      switch (FileSearchTypeOfFile) {
        case TypeOfFile.All:
          return list;
        case TypeOfFile.Document:
          return list.filter((it) => it.fileType === FileType.Document);
        case TypeOfFile.Todo:
          return list.filter((it) => it.fileType === FileType.Todo);
        default:
          return list;
      }
    } else {
      return [];
    }
  };

  useEffect(() => {
    setLoading(false);
    setFileSearch("");
    updateVars();
  }, [folderId]);

  useEffect(() => {
    updateVars();
  }, [folderData.lastUpdate]);

  useEffect(() => {
    setLoading(false);
    setFileSearch("");
    updateVars();
  }, []);

  return (
    <>
      <CreateFileDialog
        isOpen={isCreateFileDialogOpen}
        onClose={onCloseCreateFileDialog}
        folderId={folderId}
      />
      <UpdateFolderDialog
        isOpen={updateFolderOpen}
        onClose={() => setUpdateFolderOpen(false)}
        folderId={folderId}
      />
      <DeleteFolderDialog
        isOpen={deleteFolderOpen}
        onClose={() => setDeleteFolderOpen(false)}
        folderId={folderId}
      />
      <div>
        <Stack type="row" className="pb-4">
          <span className="text-xl underline underline-offset-1">
            Foram encontrados:
            <span className="font-bold">
              {" " + (fileList.length + childrenFolders.length) + " "}itens
            </span>
          </span>
          <Stack className="items-center ml-auto space-x-3">
            <Button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setIsCreateFileDialogOpen(true);
              }}
            >
              Criar Ficheiro
            </Button>
            <Menu>
              <div className="relative">
                <Menu.Button>
                  <div className="h-8 w-8 bg-gray-200 rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-300">
                    <CogIcon className="w-6 h-6" />
                  </div>
                </Menu.Button>
                <Menu.Items
                  className={`absolute bg-gray-200 z-20 right-2 top-9 p-2 rounded-md outline-none w-44`}
                >
                  <Menu.Item
                    as="div"
                    className="hover:bg-blue-200 rounded-md p-1 cursor-pointer flex items-center"
                    onClick={() => {
                      // Update Folder Handler
                      setUpdateFolderId(folderId);
                      setUpdateFolderOpen(true);
                    }}
                  >
                    <div className="w-5 h-5 mr-1">
                      <CogIcon />
                    </div>
                    <div>Atualizar Pasta</div>
                  </Menu.Item>
                  <Menu.Item
                    as="div"
                    className="hover:bg-blue-200 rounded-md p-1 cursor-pointer flex items-center"
                    onClick={() => {
                      // Delete Folder Handler
                      setDeleteFolderId(folderId);
                      setDeleteFolderOpen(true);
                    }}
                  >
                    <div className="w-5 h-5 mr-1">
                      <BanIcon />
                    </div>
                    <div>Apagar Pasta</div>
                  </Menu.Item>
                </Menu.Items>
              </div>
            </Menu>
          </Stack>
        </Stack>
        {loading && <Loader size="medium" />}
        <div className="space-y-4">
          {!loading &&
            (childrenFolders.length > 0 || (parentId && parentId !== "")) && (
              <>
                <div className="text-xl mb-2">Pastas</div>
                <Stack type="row" className="flex-wrap gap-2">
                  {parentId && parentId !== "" && (
                    <Link href={`/dashboard/f/${parentId}`}>
                      <div className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md px-2 py-1 w-8 h-8 break-all text-ellipsis overflow-hidden ">
                        <ArrowLeftIcon className="w-6" />
                      </div>
                    </Link>
                  )}
                  {childrenFolders.length > 0 &&
                    childrenFolders.map((it) => (
                      <Link
                        href={`/dashboard/f/${it.folder_id}`}
                        key={it.folder_id}
                      >
                        <div className="bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md px-2 py-1 w-48 break-all text-ellipsis overflow-hidden ">
                          {it.name}
                        </div>
                      </Link>
                    ))}
                </Stack>
              </>
            )}
          {!loading && fileList.length > 0 && (
            <Stack type="col" className="">
              <Stack type="row" className="items-center  space-x-2">
                <div className="text-xl mb-2">Ficheiros</div>
                <Stack type="row" className="w-full space-x-3">
                  <Input
                    input={{
                      type: "text",
                      placeholder: "Pesquisar",
                      name: "search",
                      onChange: (e) => setFileSearch(e.target.value),
                      value: FileSearch,
                      className: "w-full",
                    }}
                  />
                  <Listbox
                    value={FileSearchType}
                    onChange={setFileSearchType}
                    as="div"
                    className={`relative`}
                  >
                    <Listbox.Button
                      className={`bg-gray-200 px-4 py-2 rounded-xl `}
                    >
                      {FileSearchType}
                    </Listbox.Button>
                    <Listbox.Options
                      className={`absolute top-10 bg-gray-200 rounded-lg px-3 py-1 space-y-1`}
                    >
                      {Object.values(SearchType).map((type) => (
                        <Listbox.Option key={type} value={type}>
                          {type.toString()}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                  <Listbox
                    value={FileSearchTypeOfFile}
                    onChange={setFileSearchTypeOfFile}
                    as="div"
                    className={`relative`}
                  >
                    <Listbox.Button
                      className={`bg-gray-200 px-4 py-2 rounded-xl`}
                    >
                      {FileSearchTypeOfFile}
                    </Listbox.Button>
                    <Listbox.Options
                      className={`absolute top-10 bg-gray-200 rounded-lg px-3 py-1 space-y-1`}
                    >
                      {Object.values(TypeOfFile).map((type) => (
                        <Listbox.Option key={type} value={type}>
                          {type.toString()}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </Stack>
              </Stack>
              <div className="mt-4 space-y-1">
                {getFileListBySearch().map((file) => (
                  <div key={file.file_id} className="flex items-center">
                    <Link href={`/dashboard/i/${file.file_id}`}>
                      <div className="hover:text-blue-700 flex items-center cursor-pointer">
                        {file.fileType === FileType.Document ? (
                          <DocumentTextIcon className="w-5" />
                        ) : (
                          <PencilIcon className="w-5" />
                        )}
                        <div className="">{file.name}</div>
                      </div>
                    </Link>
                    <div className="ml-auto flex items-center">
                      <Menu as="div" className={`relative`}>
                        <div className="relative">
                          <Menu.Button>
                            <div className="h-8 w-8 bg-gray-200 rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-300">
                              <CogIcon className="w-6 h-6" />
                            </div>
                          </Menu.Button>
                          <Menu.Items
                            className={`absolute bg-gray-200 right-10 top-0 p-2 rounded-md outline-none w-48`}
                          >
                            <div className="absolute top-2 -right-2 w-3 h-3 bg-gray-200"></div>
                            <Menu.Item
                              as="div"
                              className="hover:bg-blue-200 rounded-md p-1 cursor-pointer flex items-center"
                              onClick={() => {
                                // File Update Handler
                                setUpdateFileId(file.file_id);
                                setUpdateFileOpen(true);
                              }}
                            >
                              <div className="w-5 h-5 mr-1">
                                <CogIcon />
                              </div>
                              <div>Atualizar Ficheiro</div>
                            </Menu.Item>
                            <Menu.Item
                              as="div"
                              className="hover:bg-blue-200 rounded-md p-1 cursor-pointer flex items-center"
                              onClick={() => {
                                // File Delete Handler
                                setDeleteFileId(file.file_id);
                                setDeleteFileOpen(true);
                              }}
                            >
                              <div className="w-5 h-5 mr-1">
                                <BanIcon />
                              </div>
                              <div>Apagar Ficheiro</div>
                            </Menu.Item>
                          </Menu.Items>
                        </div>
                      </Menu>
                    </div>
                  </div>
                ))}
              </div>
              {getFileListBySearch().length === 0 && (
                <div className="text-center font-semibold mt-4">
                  Não foram encotrados resultados
                </div>
              )}
            </Stack>
          )}
        </div>
      </div>
    </>
  );
}
