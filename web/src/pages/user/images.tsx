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

  useEffect(() => {
    gqlClient.request(getImages).then((res) => {
      if (res.allImages) {
        setImages(res.allImages as ImagesWithUrl[]);
      }
    });
  }, []);

  const uploadImage = () => {
    const formData = new FormData();
    formData.append("file", file);
    fetch(
      `${config.API.secure ? "https" : "http"}://${config.API.URL}/images`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  return (
    <>
      <NeedLogin>
        <div className="flex flex-col">
          <div className="flex flex-row items-center mb-4">
            <span className="text-xl font-medium">
              Imagens: {images.length}
            </span>
            <div className="ml-auto">
              <Button type="button" onClick={() => {}} className="text-md">
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
                      <div
                        className="w-6 cursor-pointer"
                        title="Copiar Link"
                        onClick={async () => {
                          await navigator.clipboard.writeText(`${image.url}`);
                        }}
                      >
                        <ClipboardCopyIcon />
                      </div>
                      <div
                        className="w-6 cursor-pointer"
                        title="Transferir"
                        onClick={() => {
                          const blob = new Blob([image.url], {
                            type: `${image.type}`,
                          });
                          const link = document.createElement("a");
                          link.href = URL.createObjectURL(blob);
                          link.download = `${image.name}`;
                          link.click();
                        }}
                      >
                        <DownloadIcon />
                      </div>
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
