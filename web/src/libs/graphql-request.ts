import { graphQL_Endpoint } from "../global/variables";
import { GraphQLClient } from "graphql-request";
import { accessGlobalState } from "../global/variables";

const Token = accessGlobalState();

const token =
  typeof window !== "undefined"
    ? (localStorage.getItem("token") as string)
    : Token.get();

export const gqlClient = new GraphQLClient(graphQL_Endpoint, {
  headers: {
    authorization: accessGlobalState().get()
      ? `Bearer ${accessGlobalState().get()}`
      : "",
  },
  window: typeof window === "undefined", // set to true for SSR
  credentials: "include",
});
