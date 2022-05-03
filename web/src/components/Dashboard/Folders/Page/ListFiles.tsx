import { gql, useLazyQuery } from "@apollo/client";
import Stack from "@src/components/Form/Stack/Stack";
import Loader from "@src/components/Loader/Loader";
import { FoldersContext } from "@src/context/FoldersContext";
import { Files, FileType } from "@src/graphql/graphql";
import { useContext, useEffect, useState } from "react";
import Button from "../../../Form/Buttons/Button";
import CreateFileDialog from "../../Files/Create File/CreateFile";
import { ExportedData, Maybe } from "@graphql/graphql";
import Input from "@components/Form/Inputs/Input";
import { Listbox } from "@headlessui/react";
import {
  DocumentIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import Link from "next/link";

interface props {
  folderId: string;
}

const getFilesByFolder = gql`
  query getFilesByFolder($folderId: ID!) {
    getFilesByFolder(folderId: $folderId) {
      file_id
      name
      fileType
      created_at
      updated_at
    }
  }
`;

export default function DashboardListFiles({ folderId }: props) {
  const { folderData } = useContext(FoldersContext);

  const filesFromFolders = () => {
    if (folderData.folders && folderData.folders instanceof Object) {
      const getFiles = (folders: ExportedData[]) => {
        folders.map((folder) => {
          if (folder.folder_id === folderId) {
            return folder.files;
          } else {
            if (folder.children) {
              return getFiles(folder.children as ExportedData[]);
            }
          }
        });
      };
      return getFiles(folderData.folders);
    }
  };

  function sortAscending(arr: any[]) {
    // To avoid mutating the original array, make a deep copy
    const arrToSort = Array.from(arr);

    return arrToSort.sort(
      ([a, b], [c, d]) => a.localeCompare(c) || b.localeCompare(d)
    );
  }

  const [fileList, setFileList] = useState<Files[]>([]);

  const [getNewFileList, { loading }] = useLazyQuery(getFilesByFolder, {
    variables: {
      folderId,
    },
    partialRefetch: true,
  });

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

  const getNewList = () => {
    getNewFileList().then((res) => {
      if (res.data && res.data.getFilesByFolder) {
        setFileList(res.data.getFilesByFolder);
      } else {
        setFileList([]);
      }
    });
  };

  console.log(fileList);

  useEffect(() => {
    console.log(filesFromFolders());
    getNewList();
    setFileSearch("");
  }, [folderId]);

  useEffect(() => {
    console.log(filesFromFolders());
    getNewList();
    setFileSearch("");
  }, []);

  return (
    <>
      <CreateFileDialog
        isOpen={isCreateFileDialogOpen}
        onClose={onCloseCreateFileDialog}
        folderId={folderId}
      />
      <div>
        <Stack type="row" className="pb-4">
          <span className="text-xl underline underline-offset-1">
            Foram encontrados:
            <span className="font-bold">
              {" " + fileList.length + " "}ficheiros
            </span>
          </span>
          <div className="ml-auto">
            <Button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setIsCreateFileDialogOpen(true);
              }}
            >
              Criar Ficheiro
            </Button>
          </div>
        </Stack>
        {loading && <Loader size="medium" />}
        {!loading && fileList.length > 0 ? (
          <Stack type="col">
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
                <Listbox.Button className={`bg-gray-200 px-4 py-2 rounded-xl `}>
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
                <Listbox.Button className={`bg-gray-200 px-4 py-2 rounded-xl`}>
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
            <div className="mt-4 space-y-1">
              {getFileListBySearch().map((file) => (
                <div key={file.file_id} className="flex">
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
                </div>
              ))}
            </div>
            {getFileListBySearch().length === 0 && (
              <div className="text-center font-semibold mt-4">
                Não foram encotrados resultados
              </div>
            )}
          </Stack>
        ) : (
          <div>Não foram encontrados ficheiros!</div>
        )}
      </div>
    </>
  );
}
