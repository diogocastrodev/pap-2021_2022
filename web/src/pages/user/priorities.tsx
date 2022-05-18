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
  CogIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline";

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

export default function PrioritiesPage() {
  const [isCreatePriorityOpen, setIsCreatePriorityOpen] = useState(false);
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
                        <div className="w-5">
                          <DotsVerticalIcon />
                        </div>
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
