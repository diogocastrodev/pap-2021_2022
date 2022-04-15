import { MouseEvent, useEffect } from "react";
import $ from "jquery";
import Stack from "../../../Form/Stack/Stack";
import { LinkIcon } from "@heroicons/react/outline";

interface props {
  isOpen: boolean;
  onClose: () => void;
  pos: {
    x: number;
    y: number;
  };
  file: string;
}

type menuOptions = {
  name: string;
  icon: React.ReactElement;
  onClick?: () => void;
  href?: string;
  className?: string;
};

export const itemContextMenuId = "item-context-menu";
export default function ItemContextMenu(props: props) {
  console.log(props.file);

  const options: menuOptions[] = [
    {
      name: "Open",
      onClick: () => {
        props.onClose();
      },
      icon: <LinkIcon />,
    },
    {
      name: "Delete",
      onClick: () => {
        props.onClose();
      },
      icon: <LinkIcon />,
    },
  ];

  return (
    <>
        <Stack
          type="col"
          className="bg-gray-200 rounded-md shadow-sm p-1 min-w-min min-h-min"
        >
          {options.map((option, i) => (
            <Stack
              type="row"
              key={i}
              className="w-full items-center hover:bg-blue-200 rounded-md px-2 py-1 cursor-pointer"
            >
              <div className="w-4 h-4 mr-1">{option.icon}</div>
              <span>{option.name}</span>
            </Stack>
          ))}
        </Stack>
    </>
  );
}
