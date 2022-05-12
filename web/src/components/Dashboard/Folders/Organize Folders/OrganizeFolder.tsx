import { preMadeDialogNeeded } from "@components/Dialog/PreMadeDialog";
import PreMadeDialog from "@components/Dialog/PreMadeDialog";
import AntiFocusTrap from "@components/AntiFocusTrap/AntiFocusTrap";

interface props extends preMadeDialogNeeded {}

export default function OrganizeFolderDialog(props: props) {
  return (
    <>
      <PreMadeDialog isOpen={props.isOpen} onClose={props.onClose}>
        <AntiFocusTrap
          pos={{
            x: -20,
            y: -20,
          }}
        ></AntiFocusTrap>
        <span className="text-red-400 text-opacity-80">A ser feito</span>
      </PreMadeDialog>
    </>
  );
}
