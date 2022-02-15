import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import CollectionBox from "@src/components/Collections/CollectionBox";
import Loader from "@src/components/Loader/Loader";
import { Collection } from "@src/graphql/graphql";
import Button from "@src/components/Form/Buttons/Button";
import { PlusIcon } from "@heroicons/react/solid";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import TextInput from "@src/components/Form/Inputs/TextInput";

interface props {}

const collectionListQuery = gql`
  query {
    myCollections {
      collection_id
      name
      collections_product {
        product_id
      }
    }
  }
`;

const createCollectionMutation = gql`
  mutation createCollection($name: String!) {
    createCollection(name: $name) {
      collection_id
      name
      collections_product {
        product_id
      }
    }
  }
`;

export default function CollectionsPage(props: props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createCollectionName, setCreateCollectionName] = useState<string>("");
  const [createCollectionMutationFunction] = useMutation(
    createCollectionMutation
  );
  const [collections, setCollections] = useState<Collection[]>([]);
  const [getCollectionList, { data, loading, error }] =
    useLazyQuery(collectionListQuery);

  useEffect(() => {
    getCollectionList().then((res) => {
      if (res.data) {
        setCollections(res.data.myCollections);
      }
    });
  }, []);

  const createCollection = () => {
    createCollectionMutationFunction({
      variables: {
        name: createCollectionName,
      },
    }).then((res) => {
      if (res.data) {
        setIsOpen(false);
        setCreateCollectionName("");
        setCollections([...collections, res.data.createCollection]);
      }
    });
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 overflow-y-auto z-[999]"
      >
        <Dialog.Overlay
          className={"fixed inset-0 bg-gray-700 bg-opacity-20 z-[999]"}
        />
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="bg-white w-120 z-[1000] px-8 py-4 rounded-lg h-64 flex flex-col">
            <Dialog.Title className={"text-2xl mb-4"}>
              Criar nova Coleção
            </Dialog.Title>
            <Dialog.Description className={"text-xl"}></Dialog.Description>

            <TextInput
              input={{
                color: "default",
                placeholder: "Nome da Coleção",
                setValue: (e) => {
                  setCreateCollectionName(e.target.value);
                },
                type: "text",
              }}
            />
            <div className="mt-auto flex flex-row">
              <Button
                button={{
                  color: "blue",
                  buttonType: "button",
                  label: "Criar",
                  buttonOnClick: createCollection,
                }}
              />
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
      <div className="mt-6 mx-4 flex mb-4">
        <span className="text-2xl">Coleções</span>
        <span className="ml-auto">
          <Button
            button={{
              buttonType: "button",
              color: "blue",
              label: "",
              buttonOnClick: () => setIsOpen(true),
              icon: {
                position: "left",
                icon: <PlusIcon className="w-5" />,
              },
            }}
          />
        </span>
      </div>
      <div className="flex flex-wrap justify-items-start justify-center">
        {collections.map((collection: Collection) => (
          <CollectionBox
            key={collection.collection_id}
            collection={collection}
            className="mx-4 mt-2 mb-4 start"
          />
        ))}
      </div>
    </>
  );
}
