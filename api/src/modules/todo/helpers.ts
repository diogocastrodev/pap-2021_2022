import { Priority, Todo } from "../../graphql/types";
import { db } from "../../database";

interface Priorities {
  name: string;
  color: string;
}

export const defaultPriorities: Priorities[] = [
  {
    name: "Low",
    color: "#00bcd4",
  },
  {
    name: "Medium",
    color: "#ff9800",
  },
  {
    name: "High",
    color: "#f44336",
  },
] as Priority[];
