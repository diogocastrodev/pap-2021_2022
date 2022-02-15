import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Dialog, Menu } from "@headlessui/react";
import {
  ArrowLeftIcon,
  BanIcon,
  DotsHorizontalIcon,
  PencilIcon,
} from "@heroicons/react/solid";
import Loader from "@src/components/Loader/Loader";
import ProductShowCase from "@src/components/Products/ProductShowcase";
import { Collection_Product } from "@src/graphql/graphql";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "@src/components/Form/Buttons/Button";
import { routes } from "@src/functions/routes";
import { Collection } from "../../../../../api/src/graphql/types";
import TextInput from "@src/components/Form/Inputs/TextInput";

interface props {}

const collectionByIdQuery = gql`
  query myCollection($id: ID!) {
    myCollection(id: $id) {
      collection_id
      name
      collections_product {
        product {
          product_id
          title
          titleExtraInfo
          description
          location
          sellType
          price
          created_at
          haveImages
          product_images {
            image_url
          }
        }
      }
    }
  }
`;

const deleteCollectionMutation = gql`
  mutation deleteCollection($id: ID!) {
    deleteCollection(id: $id)
  }
`;

const updateCollectionMutation = gql`
  mutation updateCollection($id: ID!, $name: String!) {
    updateCollection(id: $id, name: $name) {
      name
    }
  }
`;

export default function CollectionById(props: props) {
  const [dialogType, setDialogType] = useState<"delete" | "update">();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [collection, setCollection] = useState<Collection>();
  const [getCollectionById, { loading }] = useLazyQuery(collectionByIdQuery);
  const [updateCollectionMutationFunction] = useMutation(
    updateCollectionMutation
  );
  const [updatedName, setUpdatedName] = useState<string>("");
  const [deleteCollectionMutationFunction] = useMutation(
    deleteCollectionMutation
  );

  useEffect(() => {
    getCollectionById({
      variables: {
        id: router.query.id,
      },
    }).then((res) => {
      if (res.data) {
        setCollection(res.data.myCollection);
      }
    });
  }, []);

  if (loading) return <Loader size="medium" />;

  const deleteCollection = () => {
    deleteCollectionMutationFunction({
      variables: {
        id: collection?.collection_id,
      },
    }).then((res) => {
      if (res.data) {
        routes.redirect("/user/collections");
      }
      if (res.errors) {
        console.log(res.errors);
      }
    });
  };

  const updateCollection = () => {
    if (updatedName.length > 0) {
      updateCollectionMutationFunction({
        variables: {
          id: collection?.collection_id,
          name: updatedName,
        },
      }).then((res) => {
        if (res.data) {
          setIsOpen(false);
          setCollection(
            collection && {
              ...collection,
              name: res.data.updateCollection.name,
            }
          );
          setUpdatedName("");
        }
      });
    }
  };

  return (
    <>
      <div>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 overflow-y-auto z-[999]"
        >
          <Dialog.Overlay
            className={"fixed inset-0 bg-gray-700 bg-opacity-20 z-[999]"}
          />
          <div className="h-screen w-screen flex items-center justify-center">
            <div className="bg-white z-[1000] w-144 px-8 py-4 rounded-lg h-fit flex flex-col">
              <Dialog.Title className={"text-2xl mb-4"}>
                {dialogType === "delete" ? "Apagar Coleção" : "Editar Coleção"}
              </Dialog.Title>
              <Dialog.Description className={"text-xl"}>
                {dialogType === "delete" ? (
                  <>
                    Ao confirmar a exclusão da coleção
                    <span className="font-bold ml-1 break-words">
                      {" " + collection?.name}
                    </span>
                    , todos os produtos serão removidos da coleção.
                  </>
                ) : (
                  <>Escreva um novo nome para a sua coleção!</>
                )}
              </Dialog.Description>

              {dialogType === "delete" && (
                <p className="mt-1">
                  Ao apagar, você não poderá mais recuperar os produtos que
                  estariam guardados na coleção
                </p>
              )}

              {dialogType === "update" && (
                <TextInput
                  input={{
                    color: "default",
                    setValue: (e) => setUpdatedName(e.target.value),
                    value: updatedName,
                    type: "text",
                    placeholder: "Novo nome",
                  }}
                />
              )}

              <div className="mt-auto pt-4 flex flex-row">
                {dialogType === "delete" ? (
                  <Button
                    button={{
                      color: "red",
                      buttonType: "button",
                      label: "Apagar",
                      buttonOnClick: deleteCollection,
                    }}
                  />
                ) : (
                  <Button
                    button={{
                      color: "orange",
                      buttonType: "button",
                      label: "Atualizar",
                      buttonOnClick: updateCollection,
                    }}
                  />
                )}
                <Button
                  mainDiv={{
                    className: "ml-4",
                  }}
                  button={{
                    color: "transparent",
                    buttonType: "button",
                    label: "Cancelar",
                    className: "bg-gray-400 text-white",
                    buttonOnClick: () => setIsOpen(false),
                  }}
                />
              </div>
            </div>
          </div>
        </Dialog>
        <div className="mt-8">
          <div className="flex flex-col">
            <div onClick={() => routes.redirect(`/user/collections`)}>
              <div className="ml-2 flex flex-row text-blue-500 cursor-pointer text-md">
                <ArrowLeftIcon className="w-5" />
                <span className="ml-1">Voltar</span>
              </div>
            </div>
            <div className="flex flex-row text-3xl mt-2 mx-2">
              <span className="text-ellipsis overflow-hidden ">
                {collection?.name}
              </span>
              <span className="ml-auto my-auto">
                <Menu as="div" className={"relative"}>
                  <Menu.Button>
                    <DotsHorizontalIcon className="w-6 ml-4" />
                  </Menu.Button>
                  <Menu.Items
                    className={
                      "absolute right-0 px-2 py-1 top-8 text-lg bg-neutral-200 rounded-md min-w-fit"
                    }
                  >
                    <Menu.Item as="div" className={"my-1"}>
                      {({ active }) => (
                        <div
                          className={` px-2 py-1 ${
                            active && "bg-blue-200 rounded-lg cursor-pointer"
                          }`}
                          onClick={() => {
                            setDialogType("update");
                            setIsOpen(true);
                          }}
                        >
                          <div className="flex">
                            <PencilIcon className="w-5 mr-1" />
                            <span>Update</span>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item as="div" className={"my-1"}>
                      {({ active }) => (
                        <div
                          className={` px-2 py-1 ${
                            active && "bg-red-200 rounded-lg cursor-pointer"
                          }`}
                          onClick={() => {
                            setDialogType("delete");
                            setIsOpen(true);
                          }}
                        >
                          <div className="flex">
                            <BanIcon className="w-5 mr-1 " />
                            <span>Delete</span>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center mt-10">
          {collection?.collections_product.map(
            // @ts-ignore
            // FIX: Types
            (collectionProduct: Collection_Product) => (
              <ProductShowCase
                key={collectionProduct.product.product_id}
                product={collectionProduct.product}
              />
            )
          )}
        </div>
      </div>
    </>
  );
}
