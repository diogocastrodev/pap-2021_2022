import { gql } from "@apollo/client";
import DashboardPage from "@components/Dashboard/DashboardPage";
import TodoDisclosures from "@components/Dashboard/Items/Todo/TodosDisclosure/TodosDisclosure";
import { todosFragment } from "@src/graphql/fragments";
import { Todo } from "@src/graphql/graphql";
import { useEffect, useState } from "react";
import { gqlClient } from "@libs/graphql-request";
import Stack from "@components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
import CreateTodoDialog from "@src/components/Dashboard/Items/Todo/CreateTodo/CreateTodoDialog";

const getAllTodosQuery = gql`
  query {
    getTodos {
      todo_id
      text
      date
      status
      priority {
        priority_id
      }
    }
  }
`;

export default function TodosPage() {
  const [createTodoOpen, setCreateTodoOpen] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  async function fetchAllTodos() {
    await gqlClient
      .request(getAllTodosQuery)
      .then((res) => {
        setTodos(res.getTodos);
      })
      .catch((err) => {});
  }
  useEffect(() => {
    fetchAllTodos();
  }, []);

  return (
    <>
      <CreateTodoDialog
        isOpen={createTodoOpen}
        onClose={() => setCreateTodoOpen(false)}
        onCreate={() => {
          fetchAllTodos();
          setCreateTodoOpen(false);
        }}
      />
      <DashboardPage>
        <Stack type="col">
          <Stack type="row" className="mb-3 items-center">
            <div className="text-xl font-medium">Apontamentos</div>
            <div className="ml-auto">
              <Button type="button" onClick={() => setCreateTodoOpen(true)}>
                Criar Apontamento
              </Button>
            </div>
          </Stack>
          <TodoDisclosures
            todos={todos}
            onDump={() => {
              fetchAllTodos();
            }}
          />
        </Stack>
      </DashboardPage>
    </>
  );
}
