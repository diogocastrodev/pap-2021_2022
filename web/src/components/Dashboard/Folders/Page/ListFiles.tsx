import { gql, useLazyQuery } from "@apollo/client";
import Stack from "@src/components/Form/Stack/Stack";
import Loader from "@src/components/Loader/Loader";
import { Files } from "@src/graphql/graphql";
import { useEffect, useState } from "react";
import Button from "../../../Form/Buttons/Button";
import CreateFileDialog from "../../Files/Create File/CreateFile";

interface props {
  folderId: string;
}

const getFilesByFolder = gql`
  query getFilesByFolder($folderId: ID!) {
    getFilesByFolder(folderId: $folderId) {
      file_id
      name
    }
  }
`;

export default function DashboardListFiles({ folderId }: props) {
  const [fileList, setFileList] = useState<Files[]>([]);

  const [getNewFileList, { loading }] = useLazyQuery(getFilesByFolder, {
    variables: {
      folderId,
    },
  });

  const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] =
    useState<boolean>(false);

  const onCloseCreateFileDialog = () => {
    setIsCreateFileDialogOpen(false);
  };

  useEffect(() => {
    getNewFileList().then((res) => {
      if (res.data && res.data.getFilesByFolder) {
        setFileList(res.data.getFilesByFolder);
      }
    });
    setFileList([]);
  }, [folderId]);

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
          fileList.map((file) => <div key={file.file_id}>{file.name}</div>)
        ) : (
          <div>Não foram encontrados ficheiros!</div>
        )}
      </div>
    </>
  );
}
