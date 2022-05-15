import { gql } from "@apollo/client";
import Loader from "@src/components/Loader/Loader";
import { Files, FileType } from "@src/graphql/graphql";
import { gqlClient } from "@src/libs/graphql-request";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import DocumentPage from "./DocumentPage";
import TodoPage from "./TodoPage";

interface props {
  id: string;
}

const fileQuery = gql`
  query ($fileId: ID!) {
    getFileContent(fileId: $fileId) {
      fileType
    }
  }
`;

export default function ItemsToPage(props: props) {
  const [FileData, setFileData] = useState<Files>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    gqlClient
      .request(fileQuery, {
        fileId: props.id,
      })
      .then((res) => {
        setLoading(false);
        setFileData(res.getFileContent);
      })
      .catch((err) => {
        setLoading(false);
      });
    setFileData(undefined);
  }, [props.id]);

  return (
    <>
      {loading && <Loader size="medium" />}
      {!loading && FileData && FileData.fileType === FileType.Document && (
        <DocumentPage id={props.id} />
      )}
      {!loading && FileData && FileData.fileType === FileType.Todo && (
        <TodoPage id={props.id} />
      )}
    </>
  );
}
