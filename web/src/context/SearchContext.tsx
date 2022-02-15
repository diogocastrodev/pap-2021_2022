import { createState } from "@hookstate/core";
import { createContext } from "react";

type searchProps = {
  search: string;
};

export const searchGlobalState = createState<searchProps>({
  search: "",
});
