import { Dialog, Menu } from "@headlessui/react";
import { ExportedData } from "@src/graphql/graphql";
import { useRouter } from "next/router";
import { CSSProperties, MouseEvent, useState } from "react";

interface props {
  folder: ExportedData | ExportedData[];
  onClick?: (id: string, name: string) => void;
}

export default function TreeNode(props: props) {
  const [Color, setColor] = useState<CSSProperties>({});
  const [contextMenuOpen, setContextMenuOpen] = useState<boolean>(false);
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  }>();
  const [contextMenuFolderClicked, setContextMenuFolderClicked] = useState<{
    folder_id: string;
    name: string;
  }>();
  const router = useRouter();
  return (
    <>
      <Dialog
        open={contextMenuOpen}
        onClose={() => setContextMenuOpen(false)}
        className={`fixed h-screen w-screen inset-0 overflow-y-auto z-[999]`}
        /*  onContextMenu={(e: MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.preventDefault();
          setContextMenuOpen(false);
        }} */
      >
        <Dialog.Overlay
          className={`fixed inset-0 bg-gray-300 bg-opacity-20 z-[999]`}
        />
        <div
          className={`absolute bg-gray-200 w-64 h-32`}
          style={{
            top: contextMenuPos?.y,
            left: contextMenuPos?.x,
          }}
        >
          <span className="w-full text-center">
            {contextMenuFolderClicked?.name}
          </span>
        </div>
      </Dialog>
      <div className={`pl-3`}>
        {Array.isArray(props.folder) &&
          props.folder.map((folder: ExportedData, i) => (
            <div
              key={i}
              className={`cursor-pointer`}
              style={{
                backgroundColor: `${Color.background}`,
              }}
              /* onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContextMenuPos({
                  x: e.pageX,
                  y: e.pageY,
                });
                setContextMenuOpen(true);
                setContextMenuFolderClicked({
                  folder_id: folder.folder_id,
                  name: folder.name,
                });
              }} */
            >
              <div
                className=""
                onClick={() =>
                  props.onClick && props.onClick(folder.folder_id, folder.name)
                }
              >
                {folder.name}
              </div>
              {folder.children && folder.children.length > 0 && (
                <TreeNode
                  folder={folder.children as ExportedData[]}
                  key={i}
                  onClick={props.onClick && props.onClick}
                />
              )}
            </div>
          ))}
      </div>
    </>
  );
}
