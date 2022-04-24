import { gql, useLazyQuery, useQuery } from "@apollo/client";
import Loader from "@src/components/Loader/Loader";
import { Files, FileType } from "@src/graphql/graphql";
import { useEffect, useState } from "react";
import DocumentPage from "./DocumentPage";
import TodoPage from "./TodoPage";

interface props {
  id: string;
}

const fileQuery = gql`
  query ($data: getFileContentInput!) {
    getFileContent(data: $data) {
      name
      file_id
      folder_id
      fileType
    }
  }
`;

export default function ItemsToPage(props: props) {
  const [FileData, setFileData] = useState<Files>();
  const [getNewFile, { loading }] = useLazyQuery(fileQuery, {
    variables: {
      data: {
        fileId: props.id,
      },
    },
  });
  useEffect(() => {
    getNewFile().then((data) => {
      setFileData(data.data.getFileContent);
    });
    setFileData(undefined);
  }, [props.id]);

  return (
    <>
      {loading && <Loader size="medium" />}
      {!loading && FileData && FileData.fileType === FileType.Document ? (
        <DocumentPage id={props.id} />
      ) : (
        <TodoPage id={props.id} />
      )}
    </>
  );
}
