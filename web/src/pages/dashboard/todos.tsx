import { gql } from "@apollo/client";
import DashboardPage from "@components/Dashboard/DashboardPage";
import TodoDisclosures from "@components/Dashboard/Items/Todo/TodosDisclosure/TodosDisclosure";
import { todosFragment } from "@src/graphql/fragments";
import { Todo } from "@src/graphql/graphql";
import { useEffect, useState } from "react";
import { gqlClient } from "@libs/graphql-request";

const getAllTodosQuery = gql`
  ${todosFragment}

  query {
    getTodos {
      ...todoData
    }
  }
`;

export default function TodosPage() {
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
      <DashboardPage>
        <div>
          <TodoDisclosures todos={todos} />
        </div>
      </DashboardPage>
    </>
  );
}
