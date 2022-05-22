import { createState, State } from "@hookstate/core";

export const config = {
  port: process.env.PORT || 3000,
  API: {
    URL: process.env.API_URL || "localhost:4000",
  },
};

export const graphQL_Endpoint = `${config.API.URL}/graphql`;

const tokenFromLocalStorage =
  typeof window !== "undefined"
    ? (localStorage.getItem("token") as string)
    : "";

const TOKEN = createState(tokenFromLocalStorage);

const wrapState = (s: State<string>) => ({
  get: () => s.value,
  set: (token: string) => s.set(token),
});

export const accessGlobalState = () => wrapState(TOKEN);
