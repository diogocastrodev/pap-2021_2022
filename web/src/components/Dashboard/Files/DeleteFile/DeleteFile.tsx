import Stack from "@components/Form/Stack/Stack";
import PreMadeDialog, {
  preMadeDialogNeeded,
} from "@components/Dialog/PreMadeDialog";

interface props extends preMadeDialogNeeded {
  id: string;
}

export default function DeleteFileDialog(props: props) {
  console.log(props.id);

  async function onSubmitHandler() {}

  return (
    <>
      <PreMadeDialog {...props}>
        <form onSubmit={onSubmitHandler} method="post">
          <Stack type="col">
            <div>
              <span className="text-xl">
                Tem acerteza que deseja apagar este ficheiro?
              </span>
            </div>
          </Stack>
        </form>
      </PreMadeDialog>
    </>
  );
}
