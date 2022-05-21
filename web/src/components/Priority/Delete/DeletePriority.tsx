import { preMadeDialogNeeded } from "@components/Dialog/PreMadeDialog";
import PreMadeDialog from "@components/Dialog/PreMadeDialog";
import Stack from "@components/Form/Stack/Stack";
import { Listbox } from "@headlessui/react";
import { useState } from "react";
import Button from "@components/Form/Buttons/Button";
import { gqlClient } from "@libs/graphql-request";
import { useRouter } from "next/router";
import { gql } from "graphql-request";

interface props extends preMadeDialogNeeded {
  id: string;
}

const deleteMutation = gql`
  mutation ($id: ID!, $removeTodos: Boolean!) {
    deletePriority(id: $id, removeTodos: $removeTodos)
  }
`;

export default function DeletePriorityDialog({ isOpen, onClose, id }: props) {
  const router = useRouter();
  const options = [
    {
      label: "Apagar Prioridade e Apontamentos",
      value: "delete",
    },
    {
      label: "Apagar Prioridade e deixar Apontamentos",
      value: "update",
    },
  ];
  const [selected, setSelected] = useState(options[0]);

  async function handleRequest() {
    await gqlClient
      .request(deleteMutation, {
        id: id,
        removeTodos: selected.value === "delete" ? true : false,
      })
      .then(() => {
        onClose();
        router.reload();
      })
      .catch(() => {});
    onClose();
  }

  return (
    <>
      <PreMadeDialog isOpen={isOpen} onClose={onClose}>
        <Stack type="col">
          <div className="text-xl mb-4">
            Deseja Realmente apagar esta Prioridade?
          </div>
          <div className="ml-2 text-lg">Opções:</div>
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
              <Listbox.Button
                className={`text-left py-2 px-3 rounded-md bg-gray-100 w-full outline-none`}
              >
                {selected.label}
              </Listbox.Button>
              <Listbox.Options
                className={`absolute bg-gray-200 cursor-pointer top-10 rounded-md outline-none`}
              >
                {options.map((option, idx) => (
                  <Listbox.Option
                    key={idx}
                    value={option}
                    className={({ active }) =>
                      `${
                        active && `bg-blue-200`
                      }text-left py-2 px-3 rounded-md w-full `
                    }
                  >
                    {({ selected }) => (
                      <div className={`${selected && `text-blue-600`}`}>
                        {option.label}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <div className="mt-4">
            <Button onClick={handleRequest} className={`bg-red-400`}>
              Apagar prioridade
            </Button>
          </div>
        </Stack>
      </PreMadeDialog>
    </>
  );
}
