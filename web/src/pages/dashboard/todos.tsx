import DashboardPage from "@components/Dashboard/DashboardPage";
import TodoDisclosures from "@components/Dashboard/Items/Todo/TodosDisclosure/TodosDisclosure";
export default function TodosPage() {
  return (
    <>
      <DashboardPage>
        <div>
          <TodoDisclosures todos={[]} />
        </div>
      </DashboardPage>
    </>
  );
}
