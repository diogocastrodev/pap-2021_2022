import DashboardPage from "@components/Dashboard/DashboardPage";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Stack from "@components/Form/Stack/Stack";
import { Todo } from "@src/graphql/graphql";
import TodoDisclosures from "../../components/Dashboard/Items/Todo/TodosDisclosure/TodosDisclosure";

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

  const separeTodosByDate = () => {
    try {
      if (!calendarDate) throw new Error("calendarDate is not defined");
      const dates: IFromTo = {
        from: formatCalendarDate(calendarDate[0]),
        to: formatCalendarDate(calendarDate[1]),
      };
      console.log(dates);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (calendarDate && calendarDate.length === 2) {
      separeTodosByDate();
    }
  }, [calendarDate]);

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
            <TodoDisclosures todos={[]} />
          </div>
        </Stack>
      </DashboardPage>
    </>
  );
}
