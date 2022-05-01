import { MouseEvent, useEffect, useState } from "react";
import Stack from "@components/Form/Stack/Stack";
import { LinkIcon } from "@heroicons/react/outline";
import { Dialog } from "@headlessui/react";
import AntiFocusTrap from "@components/AntiFocusTrap/AntiFocusTrap";
import { useRouter } from "next/router";
import DeleteFileDialog from "../DeleteFile/DeleteFile";

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

export default function FileContextMenu(props: props) {
  const router = useRouter();
  const options: menuOptions[] = [
    {
      name: "Abrir",
      onClick: () => {
        router.push(`/dashboard/i/${props.file}`);
        props.onClose();
      },
      icon: <LinkIcon />,
    },
    {
      name: "Renomear",
      onClick: () => {
        router.push(`/dashboard/i/${props.file}`);
        props.onClose();
      },
      icon: <LinkIcon />,
    },
    {
      name: "Informações",
      onClick: () => {
        router.push(`/dashboard/i/${props.file}`);
        props.onClose();
      },
      icon: <LinkIcon />,
    },
    {
      name: "Apagar",
      onClick: () => {
        setIsDeleteDialogOpen(true);
        props.onClose();
      },
      icon: <LinkIcon />,
    },
  ];

  const [IsDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  return (
    <>
      <DeleteFileDialog
        id={props.file}
        onClose={() => {
          setIsDeleteDialogOpen(false);
        }}
        isOpen={IsDeleteDialogOpen}
      />
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
