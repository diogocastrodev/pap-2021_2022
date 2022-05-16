import DashboardPage from "@components/Dashboard/DashboardPage";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Stack from "@components/Form/Stack/Stack";
import { Todo } from "@graphql/graphql";
import TodoDisclosures from "@components/Dashboard/Items/Todo/TodosDisclosure/TodosDisclosure";
import { gql } from "graphql-request";
import { gqlClient } from "@libs/graphql-request";
import { todosFragment } from "@graphql/fragments";

const getAllTodos = gql`
  query {
    getDatedTodos {
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

interface IFromTo {
  from: string;
  to: string;
}

export default function CalendarPage() {
  // ISO to YYYY-MM-DD
  const convertISODate = (date: string) => {
    const dateArr = date.split("-");
    const year = dateArr[0];
    const month = dateArr[1];
    const day = dateArr[2];
    return `${year}-${month}-${day}`;
  };

  function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }

  function formatCalendarDate(date: Date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  }

  const [calendarDate, setCalendarDate] = useState<Date[]>();

  const [Todos, setTodos] = useState<Todo[]>([]);
  const [DatedTodos, setDatedTodos] = useState<Todo[]>([]);

  async function fetchAllTodos() {
    await gqlClient
      .request(getAllTodos)
      .then((res) => {
        setTodos(res.getDatedTodos);
      })
      .catch((err) => {});
  }

  const spareTodosByDate = () => {
    try {
      if (!calendarDate) throw new Error("calendarDate is not defined");
      const dates = {
        from: new Date(calendarDate[0]),
        to: new Date(calendarDate[1]),
      };
      const datedTodos = Todos.filter(
        (todo) =>
          new Date(todo.date) >= dates.from && new Date(todo.date) <= dates.to
      );
      setDatedTodos(datedTodos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (calendarDate && calendarDate.length === 2) {
      spareTodosByDate();
    }
  }, [calendarDate]);

  useEffect(() => {
    fetchAllTodos();
  }, []);

  return (
    <>
      <DashboardPage>
        <Stack type="col">
          <div className="text-center text-2xl font-medium my-3">
            Calendário
          </div>
          <Calendar
            onChange={(date: Date[]) => setCalendarDate(date)}
            value={calendarDate}
            locale={"pt"}
            selectRange={true}
            className="w-full self-center"
          ></Calendar>
          <div className="mt-6">
            <div className="mb-2 text-xl">
              <span className="font-medium">Apontamentos:</span>{" "}
              {DatedTodos.length}
            </div>
            <TodoDisclosures todos={DatedTodos} />
          </div>
        </Stack>
      </DashboardPage>
    </>
  );
}
