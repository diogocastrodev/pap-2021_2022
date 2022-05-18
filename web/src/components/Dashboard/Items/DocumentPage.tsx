import { useEffect, useState } from "react";
import { convertToRaw, EditorState, convertFromRaw } from "draft-js";
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
import { gql } from "@apollo/client";
import Loader from "@src/components/Loader/Loader";
import { gqlClient } from "@libs/graphql-request";
import Stack from "@components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
import { toast } from "react-toastify";
interface props {
  id: string;
}

const getDocumentTextQuery = gql`
  query ($fileId: ID!) {
    getFileContent(fileId: $fileId) {
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
  const [content, setContent] = useState<EditorState>(
    EditorState.createEmpty()
  );
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
        // Error
      });
  };

  const getNewDocumentText = async () => {
    gqlClient
      .request(getDocumentTextQuery, {
        fileId: props.id,
      })
      .then((res) => {
        setLoading(false);
        setFileName(res.getFileContent.name);
        setNewContent(res.getFileContent.document.content);
      })
      .catch((error) => {
        // Error
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
      <div className="p-2 rounded-md relative">
        {loading && <Loader size="medium" />}
        {!loading && (
          <>
            <div className="mb-3">
              <Stack type="row" className="items-center">
                <div className="font-bold text-xl flex flex-row text-ellipsis overflow-hidden">
                  Ficheiro: <div className="font-medium ml-2">{fileName}</div>
                </div>
                <Stack type="row" className="pl-3 space-x-2 xl:ml-auto">
                  <Button
                    type="button"
                    onClick={async () => {
                      await uploadNewDocumentContent().then(() => {
                        toast.success("Guardado com sucesso.");
                      });
                    }}
                  >
                    Guardar
                  </Button>
                  <Button type="button" onClick={clickToDownload}>
                    Transferir
                  </Button>
                </Stack>
              </Stack>
              <Stack type="row" className="items-center my-1">
                {lastUpdate && (
                  <span className="text-sm">
                    Última actualização:{" "}
                    <span className="font-medium">
                      {lastUpdate.toLocaleString("pt")}
                    </span>
                  </span>
                )}
              </Stack>
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
