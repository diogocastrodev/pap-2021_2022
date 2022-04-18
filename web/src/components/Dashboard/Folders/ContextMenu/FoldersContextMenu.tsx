import { MouseEvent, useEffect } from "react";
import Stack from "@components/Form/Stack/Stack";
import { LinkIcon } from "@heroicons/react/outline";
import { Dialog } from "@headlessui/react";
import AntiFocusTrap from "../../../AntiFocusTrap/AntiFocusTrap";
import { useRouter } from "next/router";

interface props {
  isOpen: boolean;
  onClose: () => void;
  pos: {
    x: number;
    y: number;
  };
  folder: string;
}

type menuOptions = {
  name: string;
  icon: React.ReactElement;
  onClick?: () => void;
  href?: string;
  className?: string;
};

export default function FoldersContextMenu(props: props) {
  const router = useRouter();
  const options: menuOptions[] = [
    {
      name: "Open",
      onClick: () => {
        router.push(`/dashboard/f/${props.folder}`);
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
      <Dialog open={props.isOpen} onClose={props.onClose}>
        <div
          className="absolute bg-gray-200 rounded-md shadow-sm p-1 min-w-min min-h-min z-20"
          style={{
            top: props.pos.y,
            left: props.pos.x,
          }}
        >
          {options.map((option, i) => (
            <Stack
              type="row"
              key={i}
              className="w-full items-center hover:bg-blue-200 rounded-md px-2 py-1 cursor-pointer"
              onClick={option.onClick}
            >
              <div className="w-4 h-4 mr-1">{option.icon}</div>
              <span>{option.name}</span>
            </Stack>
          ))}
        </div>
        <AntiFocusTrap pos={props.pos} />
      </Dialog>
    </>
  );
}