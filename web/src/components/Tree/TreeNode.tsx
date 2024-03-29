import { Dialog, Menu } from "@headlessui/react";
import { PencilIcon, DocumentTextIcon } from "@heroicons/react/outline";
import { ExportedData, FileType } from "@src/graphql/graphql";
import Link from "next/link";
import { useRouter } from "next/router";
import { CSSProperties, HTMLProps, MouseEvent, useState } from "react";
import ItemContextMenu from "../Dashboard/Item/ContextMenu/ContextMenu";
import { ContextMenuTrigger } from "react-contextmenu";
import { lightHex } from "@src/functions/colors";

interface props {
  folders: ExportedData | ExportedData[];
  onClick?: (id: string, name: string) => void;
  onContext?: (id: string) => void;
  folderExtra?: HTMLProps<HTMLDivElement>;
  itemExtra?: HTMLProps<HTMLDivElement>;
  showFiles?: boolean;
  redirectFolder?: boolean;
}

export default function TreeNode({
  folders,
  onClick,
  folderExtra,
  itemExtra,
  showFiles = false,
  redirectFolder = true,
  onContext,
}: props) {
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
      <ItemContextMenu
        isOpen={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        pos={contextPos}
        file={contextFileIdOpened}
      />
      <div className={`pl-3`}>
        {Array.isArray(folders) &&
          folders.map((folder: ExportedData, i) => (
            <Link
              href={`${
                redirectFolder ? `/dashboard/f/${folder.folder_id}` : `#`
              }`}
              key={folder.folder_id}
            >
              <div
                className={`cursor-pointer p-1 rounded-md mb-1`}
                style={{
                  backgroundColor: folder.color,
                  color: lightHex(folder.color),
                }}
              >
                <div
                  className=""
                  onClick={() =>
                    onClick && onClick(folder.folder_id, folder.name)
                  }
                >
                  {folder.name}
                </div>
                {showFiles && (
                  <div>
                    {folder.files?.map((file) => (
                      <Link
                        href={`/dashboard/i/${file?.file_id}`}
                        key={file!.file_id}
                      >
                        <div
                          key={file!.file_id}
                          className="mx-1 flex flex-row items-center last:pb-2"
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
                )}

                {folder.children && folder.children.length > 0 && (
                  <TreeNode
                    folders={folder.children as ExportedData[]}
                    key={folder.folder_id}
                    onClick={onClick && onClick}
                    showFiles={showFiles}
                    redirectFolder={redirectFolder}
                    onContext={onContext && onContext}
                  />
                )}
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
