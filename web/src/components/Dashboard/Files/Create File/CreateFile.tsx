import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";

interface props extends preMadeDialogNeeded {}

export default function CreateFileDialog({ isOpen, onClose }: props) {
  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        Teste
      </PreMadeDialog>
    </>
  );
}
