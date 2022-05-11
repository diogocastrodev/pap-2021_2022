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

const subDocumentText = gql`
  subscription ($updatedDocumentContentId: ID!) {
    updatedDocumentContent(id: $updatedDocumentContentId)
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

  const setNewContent = async (newContent: string) => {
    console.log("newContent", newContent);
    if (newContent === "") {
      setContent(EditorState.createEmpty());
    } else {
      setContent(
        EditorState.createWithContent(convertFromRaw(JSON.parse(newContent)))
      );
    }
    /* const blocksFromHtml = htmlToDraft(newContent);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    const editorState = EditorState.createWithContent(contentState);
    setContent(editorState); */
  };

  const convertToHtml = () => {
    const hashConfig = {
      trigger: "#",
      separator: " ",
    };
    const markup = draftToHtml(
      convertToRaw(content.getCurrentContent()),
      hashConfig,
      false
    );

    return markup;
  };

  const convertToJson = () => {
    const markup = convertToRaw(content.getCurrentContent());
    return JSON.stringify(markup);
  };

  const [setDocumentContent] = useMutation(setDocumentTextMutation, {
    variables: {
      updateDocumentId: props.id,
      content: convertToJson(),
    },
  });

  const { data } = useSubscription(subDocumentText, {
    variables: {
      updatedDocumentContentId: props.id,
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { data } = subscriptionData;
      if (data) {
        setNewContent(data.updatedDocumentContent);
      }
    },
  });

  const [getDocumentText, { loading }] = useLazyQuery(getDocumentTextQuery, {
    variables: {
      data: {
        fileId: props.id,
      },
    },
  });

  const getNewDocumentText = async () => {
    getDocumentText()
      .then((res) => {
        /* console.log(res.data.getFileContent.document.content);
        const dbContent = res.data.getFileContent.document.content;
        const blocksFromHtml = htmlToDraft(dbContent);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const editorState = EditorState.createWithContent(contentState);
        setContent(editorState); */
        setNewContent(res.data.getFileContent.document.content);
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

  var delay = (function () {
    var timer = 0;
    return function (callback: () => void | Promise<void>, ms: number) {
      clearTimeout(timer);
      // @ts-ignore
      timer = setTimeout(callback, ms);
    };
  })();

  useEffect(() => {
    if (!loading) {
      //  Once data is changed, wait a second to see if user changes it again
      /* setTimeout(() => {
      }, 1000); */
      /* delay(setDocumentContent(), 1000); */
      $("#editor-editor").on("keyup", () => {
        delay(setDocumentContent(), 1000);
      });
    }
  }, [content]);

  return (
    <>
      <div className="p-2 rounded-md shadow-md min-h-full relative">
        {loading && <Loader size="medium" />}
        {!loading && (
          /* @ts-ignore */
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
        )}
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
