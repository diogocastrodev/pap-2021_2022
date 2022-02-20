import { ExportedData } from "@src/graphql/graphql";
import TreeNode from "./TreeNode";

interface props {
  folders: ExportedData[];
}

export default function Tree(props: props) {
  return (
    <>
      <div className="flex flex-col">
        <TreeNode folder={props.folders} />
      </div>
    </>
  );
}
