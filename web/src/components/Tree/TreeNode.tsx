import { ExportedData } from "@src/graphql/graphql";
import { useState } from "react";

interface props {
  folder: ExportedData | ExportedData[];
}

export default function TreeNode(props: props) {
  console.log(props.folder);
  return (
    <>
      <ul className="list-disc pl-6">
        {Array.isArray(props.folder) &&
          props.folder.map((folder: ExportedData, i) => (
            <li key={i} className="">
              {folder.name}
              {folder.children && folder.children.length > 0 && (
                <TreeNode folder={folder.children} key={i} />
              )}
            </li>
          ))}
      </ul>
    </>
  );
}
