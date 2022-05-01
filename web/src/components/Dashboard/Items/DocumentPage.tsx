import { Files } from "@src/graphql/graphql";
import { gql } from "graphql-request";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { graphQL_request_Client } from "../../../libs/graphql-request";
import Stack from "@components/Form/Stack/Stack";
import { EditorState } from "draft-js";
import dynamic from "next/dynamic";

const Editor = dynamic(
  // @ts-ignore
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
interface props {
  id: string;
}

const getDocumentTextQuery = gql`
  query ($data: getFileContentInput!) {
    getFileContent(data: $data) {
      document {
        content
      }
    }
  }
`;

export default function DocumentPage(props: props) {
  const getNewDocumentText = async () => {
    const { data, error } = await graphQL_request_Client
      .request(getDocumentTextQuery, {
        data: {
          fileId: props.id,
        },
      })
      .then((res) => {
        console.log(res);
        return res;
      });

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
    }
  };

  useEffect(() => {
    getNewDocumentText();
  }, []);
  useEffect(() => {
    getNewDocumentText();
  }, [props.id]);

  const [content, setContent] = useState<EditorState>(
    EditorState.createEmpty()
  );

  return (
    <>
      <div className="p-2 rounded-md shadow-md min-h-full relative">
        <Editor
          editorState={content}
          onEditorStateChange={(e) => setContent(e)}
          toolbarClassName="editor-toolbar"
          wrapperClassName="textEditor-wrapper"
          editorClassName="textEditor-editor"
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
              "history",
            ],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
              urlEnabled: true,
              uploadEnabled: true,
              previewImage: true,
              alt: { present: false, mandatory: false },
            },
          }}
        ></Editor>
      </div>
    </>
  );
}

function FormatBarItem(props: { children: ReactNode }) {
  return (
    <div className="h-6 w-6 rounded-md bg-gray-100 flex items-center justify-center">
      {props.children}
    </div>
  );
}
