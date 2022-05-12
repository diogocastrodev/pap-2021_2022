import { ReactNode, useEffect, useState } from "react";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromRaw,
} from "draft-js";
import dynamic from "next/dynamic";

const Editor = dynamic(
  // @ts-ignore
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
// @ts-ignore
/* const htmlToDraft = dynamic(() => import("html-to-draftjs"), { ssr: false });
 */ import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import {
  gql,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import Loader from "@src/components/Loader/Loader";
import htmlToDraft from "html-to-draftjs";
import $ from "jquery";
import { gqlClient } from "@libs/graphql-request";
import Stack from "@components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
interface props {
  id: string;
}

const getDocumentTextQuery = gql`
  query ($data: getFileContentInput!) {
    getFileContent(data: $data) {
      name
      document {
        content
      }
    }
  }
`;

const setDocumentTextMutation = gql`
  mutation ($updateDocumentId: ID!, $content: String!) {
    updateDocument(id: $updateDocumentId, content: $content)
  }
`;

export default function DocumentPage(props: props) {
  const [content, setContent] = useState<EditorState>();
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [fileName, setFileName] = useState("");

  const setNewContent = async (newContent: string) => {
    if (newContent === "") {
      setContent(EditorState.createEmpty());
    } else {
      setContent(
        EditorState.createWithContent(convertFromRaw(JSON.parse(newContent)))
      );
    }
  };

  const convertToHtml = () => {
    const hashConfig = {
      trigger: "#",
      separator: " ",
    };
    if (content) {
      const markup = draftToHtml(
        convertToRaw(content.getCurrentContent()),
        hashConfig,
        false
      );

      return markup;
    }
  };

  const convertToJson = () => {
    if (content) {
      const markup = convertToRaw(content.getCurrentContent());
      return JSON.stringify(markup);
    }
  };

  const uploadNewDocumentContent = async () => {
    gqlClient
      .request(setDocumentTextMutation, {
        updateDocumentId: props.id,
        content: convertToJson(),
      })
      .then((res) => {
        if (res.updateDocument) {
          setLastUpdate(new Date());
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getNewDocumentText = async () => {
    gqlClient
      .request(getDocumentTextQuery, {
        data: {
          fileId: props.id,
        },
      })
      .then((res) => {
        setLoading(false);
        setFileName(res.getFileContent.name);
        setNewContent(res.getFileContent.document.content);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getNewDocumentText();
  }, []);
  useEffect(() => {
    getNewDocumentText();
  }, [props.id]);

  useEffect(() => {
    if (!loading) {
      const timeOutId = setTimeout(() => {
        uploadNewDocumentContent();
      }, 400);
      return () => clearTimeout(timeOutId);
    }
  }, [content]);

  const clickToDownload = () => {
    const html = convertToHtml();
    if (html) {
      const blob = new Blob([html], {
        type: "text/html;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
  };

  return (
    <>
      <div className="p-2 rounded-md min-h-full relative">
        {loading && <Loader size="medium" />}
        {!loading && (
          <>
            <div className="mb-3">
              <Stack type="row" className="items-center">
                <div className="font-bold text-xl flex flex-row text-ellipsis overflow-hidden">
                  Ficheiro: <div className="font-medium ml-2">{fileName}</div>
                </div>
                <div className="pl-3 ml-auto">
                  <Button type="button" onClick={clickToDownload}>
                    Transferir
                  </Button>
                </div>
              </Stack>
              <div>
                {lastUpdate && (
                  <span className="text-sm">
                    Última actualização:{" "}
                    <span className="font-medium">
                      {lastUpdate.toLocaleString("pt-PT")}
                    </span>
                  </span>
                )}
              </div>
            </div>
            {/* @ts-ignore */}
            <Editor
              /* @ts-ignore */
              editorState={content}
              onEditorStateChange={(e: EditorState) => setContent(e)}
              toolbarClassName="editor-toolbar"
              wrapperClassName="editor-wrapper"
              editorClassName="editor-editor"
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "fontFamily",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "embedded",
                  "emoji",
                  "image",
                ],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                image: {
                  urlEnabled: true,
                  uploadEnabled: true,
                  previewImage: true,
                  alt: { present: false, mandatory: false },
                },
              }}
            ></Editor>
          </>
        )}
      </div>
    </>
  );
}
