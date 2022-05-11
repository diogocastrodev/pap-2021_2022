import { GraphQLError } from "graphql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

/* .env data */
export const config = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "secret",
  SESSION_SECRET: process.env.SESSION_SECRET || "secret",
  PORT: process.env.PORT || "5000",
  ARGON_SECRET: bcrypt.hash(process.env.ARGON_SECRET || "secret", 10),
  env: process.env.NODE_ENV || "development",
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
