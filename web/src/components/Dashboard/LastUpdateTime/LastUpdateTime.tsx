import { Dialog } from "@headlessui/react";
import { FoldersContext } from "@src/context/FoldersContext";
import moment from "moment";
import { useContext } from "react";
import PreMadeDialog, { preMadeDialogNeeded } from "../../Dialog/PreMadeDialog";
interface props extends preMadeDialogNeeded {
  pos: {
    x: number;
    y: number;
  };
}

export default function LastUpdateTimeFolders({ onClose, isOpen, pos }: props) {
  const folders = useContext(FoldersContext);
  return (
    <>
      <Dialog
        className={`absolute`}
        style={{
          top: pos.y + 10,
          left: pos.x + 10,
        }}
        onClose={onClose}
        open={isOpen}
        onMouseEnter={onClose}
      >
        {folders.folderData.loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div
              className={`py-1 px-2 bg-gray-100 shadow-md rounded-md select-none`}
            >
              Atualizado {moment(folders.folderData.lastUpdate).fromNow()}
            </div>
            <button className="h-0 w-0 overflow-hidden" />
          </>
        )}
      </Dialog>
    </>
  );
}
