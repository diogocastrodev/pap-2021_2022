import { gql, useMutation } from "@apollo/client";
import { CreateProductInput, ProductSellType } from "@src/graphql/graphql";
import axios from "axios";
import router from "next/router";
import { FormEvent, useState } from "react";

const uploadImagesMutation = gql`
  mutation ($data: uploadImagesInput!) {
    uploadImages(data: $data)
  }
`;

const createProductMutation = gql`
  mutation ($data: createProductInput!) {
    createProduct(data: $data)
  }
`;

export default function CreateProductPage() {
  const [selectedFile, setSelectedFile] = useState<FileList>();

  const [uploadImages] = useMutation(uploadImagesMutation);
  const [createProduct] = useMutation(createProductMutation);

  const [ProductIDCreated, setProductIDCreated] = useState<string>("");

  console.log(selectedFile);
  return (
    <div>
      <form
        method="POST"
        encType="multipart/form-data"
        onSubmit={async (event: FormEvent) => {
          if (!selectedFile) {
            return;
          }
          event.preventDefault();

          await createProduct({
            variables: {
              data: {
                title: "String!",
                titleExtraInfo: "String",
                description: "String!",
                location: "String!",
                sellType: ProductSellType.Sell,
                price: 20.0,
              },
            },
          })
            .then(async (res) => {
              var productId = res.data.createProduct;
              const formData = new FormData();

              formData.append("productId", productId);
              for (let i = 0; i < selectedFile.length; i++) {
                formData.append("images", selectedFile[i]);
              }

              /* FIX: Create product */
              await axios
                .post("http://localhost:5000/upload/images", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data;",
                  },
                })
                .then(async (res) => {
                  await uploadImages({
                    variables: {
                      data: {
                        product_id: productId,
                        images: res.data.fileNames,
                      },
                    },
                  })
                    .then(async (res) => {
                      router.push(`/product/${res.data.uploadImages}`);
                    })
                    .catch((err) => {
                      console.log("Error Saving Images: " + err);
                    });
                })
                .catch((err) => {
                  console.log("Error Uploading: " + err);
                });
            })
            .catch((err) => {
              console.log("Error Creating Product: " + err);
            });
        }}
      >
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => {
            setSelectedFile(e.target.files as FileList);
          }}
          multiple={true}
        />
        <button type="submit">Submit</button>
      </form>
      {selectedFile && <div></div>}
    </div>
  );
}
