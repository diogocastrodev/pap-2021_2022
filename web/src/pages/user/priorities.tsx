import NeedLogin from "@components/Login/NeedLogin";
import Stack from "@components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
import { gql } from "graphql-request";
import { Priority } from "@src/graphql/graphql";
import { useEffect, useState } from "react";
import { gqlClient } from "@libs/graphql-request";
import { lightHex } from "@src/functions/colors";
import CreatePriorityDialog from "../../components/Priority/Create/CreatePriority";

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
      <NeedLogin>
        <div className="w-full h-full">
          <Stack type="col">
            <Stack type="row" className="items-center">
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
            <Stack type="col">
              {Priorities &&
                Priorities.map((priority) => (
                  <div
                    key={priority.priority_id}
                    className="flex flex-row items-center last:pb-2"
                  >
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{
                        backgroundColor: priority.color,
                        color: lightHex(priority.color),
                      }}
                    ></div>
                    <span className="ml-2">{priority.name}</span>
                  </div>
                ))}
            </Stack>
          </Stack>
        </div>
      </NeedLogin>
    </>
  );
}
