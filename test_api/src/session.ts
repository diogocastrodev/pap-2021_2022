import session from "express-session";
import { User } from "./graphql/types";

export = session;

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}
