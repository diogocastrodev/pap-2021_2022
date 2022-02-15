import { GraphQLError } from "graphql";
import dotenv from "dotenv";

dotenv.config();

/* .env data */
export const config = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "secret",
  PORT: process.env.PORT || "5000",
  API_CDN_Private_Key: process.env.API_CDN_Private_Key || "api-cdn",
  FRONTEND_URL: process.env.FRONTEND_URL || "localhost:3000",
  FRONTEND_SSL: process.env.FRONTEND_SSL || "false",
  CDN_URL: process.env.CDN_URL || "localhost:5000",
  smtp: {
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE || false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASSWORD || "",
    },
  },
  images: {
    allowedTypes: ["png", "jpeg", "jpg"],
    product: {
      maxFiles: 20,
      maxSize: 8 * 1000 * 1000,
    },
    avatar: {
      maxFiles: 1,
      maxSize: 5 * 1000 * 1000, // 5 MB
    },
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
