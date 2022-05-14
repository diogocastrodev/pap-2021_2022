import NeedLogin from "@components/Login/NeedLogin";
import {
  ClipboardCopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import Input from "@src/components/Form/Inputs/Input";
import { config } from "@src/global/variables";
import { gqlClient } from "@src/libs/graphql-request";
import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import Button from "@components/Form/Buttons/Button";
import { ImagesWithUrl } from "@src/graphql/graphql";
import UploadImageDialog from "@src/components/Images/UploadImageDialog";
import { browser } from "process";
import axios from "axios";

const getImages = gql`
  query getImages {
    allImages {
      url
      type
      name
    }
  }
`;

export default function UserImagesPage() {
  const [images, setImages] = useState<ImagesWithUrl[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const fetchImages = async () => {
    await gqlClient.request(getImages).then((res) => {
      if (res.allImages) {
        setImages(res.allImages as ImagesWithUrl[]);
      }
    });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <UploadImageDialog
        isOpen={isUploadDialogOpen}
        onClose={() => {
          setIsUploadDialogOpen(false);
        }}
        onSuccess={() => {
          fetchImages();
        }}
      />
      <NeedLogin>
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-row items-center mb-4">
            <span className="text-xl font-medium">
              Imagens: {images.length}
            </span>
            <div className="ml-auto">
              <Button
                type="button"
                onClick={() => {
                  setIsUploadDialogOpen(true);
                }}
                className="text-md"
              >
                Adicionar Imagem
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap w-full h-full gap-3">
            {images.map((image, i) => (
              <div
                className="flex flex-col w-64 h-72 bg-white rounded-md"
                key={i}
              >
                <div className="w-64 h-64 bg-gray-300 rounded-md">
                  <img
                    src={`${image.url}`}
                    className="rounded-md aspect-square outline-none w-64 h-64 object-cover"
                  />
                </div>
                <div className="flex-1 w-full flex items-center">
                  <div className="h-6 w-full flex flex-row items-center px-1 py-0.5">
                    <div className="w-full">
                      <div className="h-7 bg-gray-200 rounded-md">
                        <Input
                          input={{
                            value: `${image.url}`,
                            className: "w-full h-full px-2 py-1 cursor-text",
                            disabled: true,
                          }}
                          mainDiv={{
                            className: "w-full h-full ",
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row items-center pl-1">
                      <a
                        className="w-6"
                        title="Abrir em outro separador"
                        href={`${image.url}`}
                        target="_blank"
                      >
                        <ExternalLinkIcon />
                      </a>
                      {window.isSecureContext && (
                        <div
                          className="w-6 cursor-pointer"
                          title="Copiar Link"
                          onClick={async () => {
                            await navigator.clipboard.writeText(`${image.url}`);
                          }}
                        >
                          <ClipboardCopyIcon />
                        </div>
                      )}
                      <a
                        className="w-6 cursor-pointer"
                        title="Transferir"
                        /*                         href={`${image.url}`}
                        target="_blank" */
                        onClick={() => {
                          axios
                            .post(image.url, undefined, {
                              responseType: "blob",
                            })
                            .then((res) => {
                              const url = window.URL.createObjectURL(
                                new Blob([res.data])
                              );
                              const link = document.createElement("a");
                              link.href = url;
                              link.setAttribute("download", `${image.name}`);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            });
                        }}
                      >
                        <DownloadIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </NeedLogin>
    </>
  );
}
