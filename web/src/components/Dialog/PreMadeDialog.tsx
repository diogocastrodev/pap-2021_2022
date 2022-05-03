import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

export interface preMadeDialogNeeded {
  isOpen: boolean;
  onClose: () => void;
}

interface props extends preMadeDialogNeeded {
  children?: React.ReactNode | React.ReactNode[] | undefined;
}

export default function PreMadeDialog(props: props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          props.onClose();
        }}
        className="fixed inset-0 overflow-y-auto z-[999]"
      >
        <Dialog.Overlay
          className={"fixed inset-0 bg-gray-700 bg-opacity-20 z-[999]"}
        />
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="bg-white w-2/3 z-[1000] px-8 py-4 rounded-lg min-h-min flex flex-col">
            {props.children}
          </div>
        </div>
      </Dialog>
    </>
  );
}
