import { GraphQLError } from "graphql";
import dotenv from "dotenv";

dotenv.config();

/* .env data */
export const config = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "secret",
  SESSION_SECRET: process.env.SESSION_SECRET || "secret",
  PORT: process.env.PORT || "5000",
};

export type Depromisify<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export function formatError(err: GraphQLError): GraphQLError {
  //@ts-expect-error
  delete err.extensions;
  return err;
}
