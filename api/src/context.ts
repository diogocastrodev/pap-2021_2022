import { Depromisify } from "./utils";
import { Request, Response } from "express";

/* Resolvers context param */
export interface ResolverContext {
  is_authed: boolean;
  user_id?: string;
  request: Request;
  response: Response;
}

/* context function params */
type ContextProps = {
  req: Request;
  res: Response;
};

/* This function will be executed when get a GraphQL Request */
export const context = async ({ req, res }: ContextProps) => {
  /* Initialize context as user not authed */
  const ctx: ResolverContext = {
    is_authed: false,
    request: req,
    response: res,
  };

  const session = req.session;

  if (session && session.is_logged) {
    ctx.is_authed = true;
    ctx.user_id = session.public_user_id;
  }

  return ctx;

  /* Get Token from headers */
  /* let token: string = req.headers.authorization || ""; */

  // if (token) {
  //   /* Check if request contains Bearer if so will remove "Bearer " and get only the token */
  //   if (token.startsWith("Bearer ")) token = token.split(" ")[1];

  //   try {
  //     /* Check if token is valid */
  //     const decoded = jwt.verify(token, config.TOKEN_SECRET);
  //     /* If token isn't valid will return the context as user not authed */
  //     if (typeof decoded === "string") return ctx;
  //     /*
  //               otherwise will get user_id and it exists will set authed to true and add the user_id
  //               so, in GraphQL resolvers will be able to use it or check if user is logged in
  //           */
  //     if (decoded.user_id) {
  //       ctx.is_authed = true;
  //       ctx.user_id = decoded.user_id;
  //     }
  //   } catch (e) {
  //     /* Silence */
  //   }
  //   return ctx;
  // }
  // return ctx;
};

export type Context = Depromisify<typeof context>;
