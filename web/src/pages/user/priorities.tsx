import NeedLogin from "@components/Login/NeedLogin";
import Stack from "@components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
import { gql } from "graphql-request";
import { Priority } from "@src/graphql/graphql";
import { useEffect, useState } from "react";
import { gqlClient } from "@libs/graphql-request";
import { lightHex } from "@src/functions/colors";
import CreatePriorityDialog from "../../components/Priority/Create/CreatePriority";
import ToTheMoon from "../../components/Extras/ToTheMoon";
import {
  BanIcon,
  CogIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import { Menu } from "@headlessui/react";
import DeletePriorityDialog from "@components/Priority/Delete/DeletePriority";
import UpdatePriorityDialog from "@components/Priority/Update/UpdatePriority";

const getPriorities = gql`
  query {
    priorities {
      priority_id
      name
      order
      color
    }
  }
`;

interface IItems {
  name: string;
  onClick: (id: string) => void;
  icon?: JSX.Element;
}

export default function PrioritiesPage() {
  const [isCreatePriorityOpen, setIsCreatePriorityOpen] = useState(false);

  const [isUpdatePriorityOpen, setIsUpdatePriorityOpen] = useState(false);
  const [updatePriority, setUpdatePriority] = useState<Priority>();

  const [isDeletePriorityOpen, setIsDeletePriorityOpen] = useState(false);
  const [deletePriorityID, setDeletePriorityID] = useState("");

  const [Priorities, setPriorities] = useState<Priority[] | undefined>(
    undefined
  );

  async function fetchPriorities() {
    await gqlClient
      .request(getPriorities)
      .then((res) => {
        setPriorities(res.priorities);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    fetchPriorities();
  }, []);
  return (
    <>
      <CreatePriorityDialog
        isOpen={isCreatePriorityOpen}
        onClose={() => setIsCreatePriorityOpen(false)}
        onSuccess={fetchPriorities}
      />
      <UpdatePriorityDialog
        isOpen={isUpdatePriorityOpen}
        onClose={() => setIsUpdatePriorityOpen(false)}
        priority={updatePriority}
        onSuccess={fetchPriorities}
      />
      <DeletePriorityDialog
        isOpen={isDeletePriorityOpen}
        onClose={() => setIsDeletePriorityOpen(false)}
        id={deletePriorityID}
      />
      <ToTheMoon></ToTheMoon>
      <NeedLogin>
        <div className="w-full h-full">
          <Stack type="col" className="">
            <Stack type="row" className="items-center sticky top-4 mb-3">
              <div className="text-xl font-semibold">Prioridades</div>
              <div className="ml-auto">
                <Button
                  type="button"
                  onClick={() => setIsCreatePriorityOpen(true)}
                >
                  Criar Prioridade
                </Button>
              </div>
            </Stack>
            <Stack type="col" className="space-y-3">
              {Priorities &&
                Priorities.map((priority) => (
                  <div
                    key={priority.priority_id}
                    className="flex flex-row items-center last:pb-2"
                  >
                    <div
                      className="w-full py-2 px-1 mx-3 rounded-full flex items-center"
                      style={{
                        backgroundColor: priority.color,
                        color: lightHex(priority.color),
                      }}
                    >
                      <span className="ml-2">{priority.name}</span>
                      <div className="ml-auto px-3 flex items-center space-x-3">
                        <Menu as="div" className={`relative flex items-center`}>
                          <Menu.Button className={`relative outline-none`}>
                            <div className="w-5">
                              <DotsVerticalIcon />
                            </div>
                          </Menu.Button>
                          <Menu.Items
                            className={`text-black absolute z-[99] right-4 top-4 py-3 px-2 min-w bg-gray-100 rounded-md shadow-md select-none focus:outline-none space-y-1`}
                          >
                            <Menu.Item>
                              {({ active }: { active: boolean }) => (
                                <div
                                  className={`${
                                    active && "bg-blue-200"
                                  } px-2 py-1 rounded-lg flex items-center cursor-pointer`}
                                  onClick={() => {
                                    setUpdatePriority(priority);
                                    setIsUpdatePriorityOpen(true);
                                  }}
                                >
                                  <div className="w-5 h-5">
                                    <RefreshIcon />
                                  </div>
                                  <span className="ml-1">Atualizar</span>
                                </div>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }: { active: boolean }) => (
                                <div
                                  className={`${
                                    active && "bg-blue-200"
                                  } px-2 py-1 rounded-lg flex items-center cursor-pointer`}
                                  onClick={() => {
                                    setDeletePriorityID(priority.priority_id);
                                    setIsDeletePriorityOpen(true);
                                  }}
                                >
                                  <div className="w-5 h-5">
                                    <BanIcon />
                                  </div>
                                  <span className="ml-1">Apagar</span>
                                </div>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Menu>
                      </div>
                    </div>
                  </div>
                ))}
            </Stack>
          </Stack>
        </div>
      </NeedLogin>
    </>
  );
}
