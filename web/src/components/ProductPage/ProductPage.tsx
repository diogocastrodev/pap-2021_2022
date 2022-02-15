import { Product, ProductSellType } from "@src/graphql/graphql";
import ImageSlider from "../Utils/ImageSlider/ImageSlider";
import ProfileBanner from "../Profile/ProfileBanner";
import { formatMoney } from "@src/functions/formatMoney";
import Button from "@src/components/Form/Buttons/Button";
import { ArchiveIcon, PhoneIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Collection } from "../../../../api/src/graphql/types";
import { useEffect, useState } from "react";

interface props {
  product: Product;
}

const getCollections = gql`
  query myCollections {
    myCollections {
      collection_id
      name
      collections_product {
        product_id
      }
    }
  }
`;

const addProductToCollectionMutation = gql`
  mutation ($collectionId: ID!, $productId: ID!) {
    addProductToCollection(collectionId: $collectionId, productId: $productId) {
      product_id
    }
  }
`;

const removeProductFromCollectionMutation = gql`
  mutation ($collectionId: ID!, $productId: ID!) {
    removeProductFromCollection(
      collectionId: $collectionId
      productId: $productId
    )
  }
`;

export default function ProductPage(props: props) {
  const [collections, setCollections] = useState<Collection[]>();
  const [getCollectionsFunction] = useLazyQuery(getCollections);
  const [addProductToCollectionMutationFunction] = useMutation(
    addProductToCollectionMutation
  );
  const [removeProductFromCollectionMutationFunction] = useMutation(
    removeProductFromCollectionMutation
  );

  useEffect(() => {
    getCollectionsFunction().then((res) => {
      if (res.data) {
        setCollections(res.data.myCollections);
      }
    });
  }, []);

  const removeProductFromCollection = (collection: string) => {
    removeProductFromCollectionMutationFunction({
      variables: {
        collectionId: collection,
        productId: props.product.product_id,
      },
    }).then((res) => {
      if (res.data) {
        setCollections(
          collections?.map((collection) => {
            if (
              collection.collection_id === res.data.removeProductFromCollection
            ) {
              return {
                ...collection,
                collections_product: collection.collections_product.filter(
                  (product) => product?.product_id !== props.product.product_id
                ),
              };
            }
            return collection;
          })
        );
      }
    });
  };

  const addProductToCollection = (collection: string) => {
    addProductToCollectionMutationFunction({
      variables: {
        collectionId: collection,
        productId: props.product.product_id,
      },
    }).then((res) => {
      if (res.data) {
        setCollections(
          /* FIX: Types */
          // @ts-ignore
          collections?.map((col) => {
            if (col.collection_id === collection) {
              return {
                ...col,
                collections_product: [
                  ...col.collections_product,
                  {
                    product_id: props.product.product_id,
                  },
                ],
              };
            } else {
              return col;
            }
          })
        );
      }
    });
  };
  return (
    <>
      <div className="mx-2 mt-2">
        <div className="flex flex-col lg:flex-row justify-center lg:justify-start w-full">
          <div className="h-full sm:w-3/4 w-full max-w-screen-sm self-center lg:self-start">
            <ImageSlider
              // @ts-ignore
              // FIX: Fix this type :|
              images={props.product.product_images}
              haveImages={props.product.haveImages}
              product_id={props.product.product_id}
            />
          </div>
          <div className="flex flex-col mt-6 lg:ml-3 mx-8">
            <span className="text-3xl">{props.product.title}</span>
            <span className="opacity-70 text-xl">
              {props.product.titleExtraInfo}
            </span>
            <span className="mt-4 text-xl flex flex-col">
              Disponivel para:{" "}
              {props.product.sellType === ProductSellType.Sell
                ? "Venda"
                : "Troca"}
              <span>
                {props.product.sellType === ProductSellType.Sell &&
                  props.product.price &&
                  `Preço: ${formatMoney(props.product.price)} €`}
              </span>
            </span>
            <div className="mt-2.5 lg:mt-auto flex flex-row">
              <Button
                button={{
                  buttonType: "button",
                  color: "blue",
                  label: "Contactar",
                  icon: {
                    position: "left",
                    icon: <PhoneIcon className="w-5 h-5 mr-2" />,
                  },
                }}
              />
              <Menu as="div" className={"relative"}>
                <Menu.Button as="div">
                  <Button
                    button={{
                      buttonType: "button",
                      color: "yellow",
                      label: "Guardar",
                      className: "ml-2",
                      icon: {
                        position: "left",
                        icon: <ArchiveIcon className="w-5 h-5 mr-2" />,
                      },
                    }}
                  />
                </Menu.Button>
                <Menu.Items
                  className={
                    "absolute top-10  bg-gray-200 px-4 py-2 w-fit max-w-md rounded-md shadow-md max-h-56 space-y-2"
                  }
                >
                  {collections && collections.length > 0 ? (
                    collections.map((collection: Collection) => (
                      <Menu.Item
                        key={collection.collection_id}
                        as="div"
                        className={""}
                      >
                        <div className="text-ellipsis overflow-hidden">
                          {collection.collections_product.filter((fil) => {
                            return fil?.product_id === props.product.product_id;
                          }).length > 0 ? (
                            <div
                              className={`cursor-pointer font-bold`}
                              onClick={() => {
                                removeProductFromCollection(
                                  collection.collection_id
                                );
                              }}
                            >
                              {collection.name}
                            </div>
                          ) : (
                            <div
                              className={`cursor-pointer`}
                              onClick={() =>
                                addProductToCollection(collection.collection_id)
                              }
                            >
                              {collection.name}
                            </div>
                          )}
                        </div>
                      </Menu.Item>
                    ))
                  ) : (
                    <span>Não foram encontradas Coleções</span>
                  )}
                </Menu.Items>
              </Menu>
            </div>
          </div>
        </div>
        <div className="mx-4 mt-4 lg:mt-8">
          <div className="bg-gray-50 p-4 rounded-lg shadow-lg">
            <div className="text-2xl pb-1 border-b-2 border-b-gray-200 mb-2 pl-2">
              Descrição do Produto
            </div>
            <div className="mx-2 break-words">{props.product.description}</div>
          </div>
          <div className="ml-6 mt-6">
            <div className="text-2xl">Vendedor</div>
            <div className="flex mt-6 ml-4">
              <ProfileBanner
                avatar={{
                  hasAvatar: props.product.user.haveAvatar,
                  // @ts-ignore
                  // Fix: this later
                  userId: props.product.user.public_user_id,
                }}
                sizes="h-24 w-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-44 lg:h-44"
              />
              <div className="h-full ml-4 flex flex-col">
                <a
                  className="text-2xl"
                  href={`/profile/${props.product.user.public_user_id}`}
                >
                  {props.product.user.name} {props.product.user.surname}
                </a>
                <span className="opacity-70 truncate overflow-hidden">
                  {props.product.user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
