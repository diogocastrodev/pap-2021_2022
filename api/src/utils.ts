import { GraphQLError } from "graphql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

/* .env data */
export const config = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "secret",
  SESSION_SECRET: process.env.SESSION_SECRET || "secret",
  PORT: process.env.PORT || "5000",
  ARGON_SECRET: bcrypt.hash(process.env.ARGON_SECRET || "secret", 6),
  env: process.env.NODE_ENV || "development",
  CDN: {
    URL: process.env.CDN_URL || "http://localhost:5000",
    KEY: process.env.API_CDN_Private_Key || "api-cdn",
  },
  images: {
    types: ["png", "jpeg", "jpg"],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
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
