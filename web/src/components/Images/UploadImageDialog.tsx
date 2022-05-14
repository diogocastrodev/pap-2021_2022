import { config } from "@src/global/variables";
import { FormEvent, useState } from "react";
import PreMadeDialog, { preMadeDialogNeeded } from "../Dialog/PreMadeDialog";
import Stack from "@components/Form/Stack/Stack";
import axios from "axios";
import Form from "@components/Form/Form/Form";
import Input from "@components/Form/Inputs/Input";
import Button from "@components/Form/Buttons/Button";

interface props extends preMadeDialogNeeded {
  onSuccess: () => void;
}

export default function UploadImageDialog({
  isOpen,
  onClose,
  onSuccess,
}: props) {
  const [files, setFiles] = useState<FileList | null>(null);

  async function uploadImage(e: FormEvent) {
    e.preventDefault();
    if (files) {
      const formData = new FormData();
      for (let index = 0; index < files?.length; index++) {
        formData.append("images", files[index]);
      }
      await axios
        .post(
          `${config.API.secure ? "https" : "http"}://${
            config.API.URL
          }/upload/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          onClose();
          if (res.status === 200) {
            onSuccess();
          }
        })
        .catch((err) => {});
    }
  }
  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <Stack type="col">
          <div className="text-xl mb-4">Upload de Imagens</div>
          <div>
            <Form onSubmit={uploadImage} method="POST">
              <Input
                input={{
                  type: "file",
                  multiple: true,
                  onChange: (e) => {
                    setFiles(e.target.files);
                  },
                  accept: ".jpg, .jpeg, .png",
                }}
              />
              <Button className="mt-4">Enviar</Button>
            </Form>
          </div>
        </Stack>
      </PreMadeDialog>
    </>
  );
}
