import { Files } from "@src/graphql/graphql";
import { gql } from "graphql-request";
import { useEffect, useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { graphQL_request_Client } from "../../../libs/graphql-request";

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
  /* const [content, setContent] = useState<string>("**Loading...**"); */

  console.log(props.id);
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

  const example: Descendant[] = [
    {
      children: [
        {
          text: "yeet",
        },
      ],
    },
  ];

  useEffect(() => {
    getNewDocumentText();
  }, []);
  useEffect(() => {
    getNewDocumentText();
  }, [props.id]);

  const editor = useMemo(() => withReact(createEditor() as ReactEditor), []);

  return (
    <>
      <div>
        {/* <MDEditor value={content} onChange={setContent} />
        <MDEditor.Markdown source={content} /> */}
        <Slate editor={editor} value={example}>
          <Editable />
        </Slate>
      </div>
    </>
  );
}
