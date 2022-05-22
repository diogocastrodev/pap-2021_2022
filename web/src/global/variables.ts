import { createState, State } from "@hookstate/core";

export const config = {
  port: process.env.PORT || 3000,
  API: {
    URL: process.env.API_URL || "localhost:4000",
    secure: process.env.API_Secure || false,
  },
};

const httpProtocolSecure = config.API.secure ? "https" : "http";
const wsProtocolSecure = config.API.secure ? "wss" : "ws";

export const graphQL_Endpoint = `${httpProtocolSecure}://${config.API.URL}/graphql`;
export const graphQL_Endpoint_Ws = `${wsProtocolSecure}://${config.API.URL}/graphql`;

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
