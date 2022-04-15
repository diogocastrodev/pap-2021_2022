import { Dialog, Menu } from "@headlessui/react";
import { PencilIcon, DocumentTextIcon } from "@heroicons/react/outline";
import { ExportedData, FileType } from "@src/graphql/graphql";
import Link from "next/link";
import { useRouter } from "next/router";
import { CSSProperties, HTMLProps, MouseEvent, useState } from "react";
import ItemContextMenu, {
  itemContextMenuId,
} from "../Dashboard/Item/ContextMenu/ContextMenu";
import { ContextMenuTrigger } from "react-contextmenu";

interface props {
  folder: ExportedData | ExportedData[];
  onClick?: (id: string, name: string) => void;
  folderExtra?: HTMLProps<HTMLDivElement>;
  itemExtra?: HTMLProps<HTMLDivElement>;
}

export default function TreeNode(props: props) {
  const [Color, setColor] = useState<CSSProperties>({});

  const [contextPos, setContextPos] = useState({
    x: 0,
    y: 0,
  });
  const [contextFileIdOpened, setContextFileIdOpened] = useState<string>("");
  const [isContextOpen, setIsContextOpen] = useState<boolean>(false);

  const router = useRouter();
  return (
    <>
      {/* <ItemContextMenu
        isOpen={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        pos={contextPos}
        file={contextFileIdOpened}
      /> */}
      <div className={`pl-3`}>
        {Array.isArray(props.folder) &&
          props.folder.map((folder: ExportedData, i) => (
            <Link
              href={`/dashboard/f/${folder.folder_id}`}
              key={folder.folder_id}
            >
              <div className={`cursor-pointer`}>
                <div
                  className=""
                  onClick={() =>
                    props.onClick &&
                    props.onClick(folder.folder_id, folder.name)
                  }
                >
                  {folder.name}
                </div>
                <div>
                  {folder.files?.map((file) => (
                    <Link
                      href={`/dashboard/i/${file?.file_id}`}
                      key={file?.file_id}
                    >
                      <div
                        key={file?.file_id}
                        className="mx-1 flex flex-row items-center"
                        /*  onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setContextPos({
                              x: e.clientX,
                              y: e.clientY,
                            });
                            setIsContextOpen(true);
                            setContextFileIdOpened(file!.file_id);
                          }} */
                      >
                        {file?.fileType === FileType.Document ? (
                          <DocumentTextIcon className="w-5" />
                        ) : (
                          <PencilIcon className="w-5" />
                        )}
                        <span>{file?.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                {folder.children && folder.children.length > 0 && (
                  <TreeNode
                    folder={folder.children as ExportedData[]}
                    key={folder.folder_id}
                    onClick={props.onClick && props.onClick}
                  />
                )}
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
