import { AuthenticationError } from "apollo-server-errors";
import { ResolverContext } from "../../context";
import { Resolvers } from "../../graphql/types";
import { db } from "../../database";
import { verifyPassword, createPassword } from "./helpers";
import * as jwt from "jsonwebtoken";
import { config } from "../../utils";
import cookie from "cookie";
import bcrypt from "bcrypt";

// TODO: Add context to resolver
export const UserResolvers: Resolvers<ResolverContext> = {
  Query: {
    me: async (_parent, _args, context) => {
      if (!context.is_authed || !context.user_id)
        throw new AuthenticationError("no login");

      const userData = await db.user.findUnique({
        where: {
          user_id: context.user_id.toString(),
        },
      });

      if (!userData) throw new Error("User not found");

      return userData;
    },
    checkToken: async (_parent, _args, context) => {
      return context.is_authed;
    },
  },
  Mutation: {
    login: async (_parent, args, context) => {
      if (!args.data || !args.data.email || !args.data.password)
        throw new Error("Email or password is missing");

      const userData = await db.user.findUnique({
        where: {
          email: args.data.email.toString(),
        },
      });

      if (!userData) throw new Error("User not found");

      const isPasswordValid = verifyPassword(
        args.data.password,
        userData.password
      );

      if (!isPasswordValid) throw new Error("Invalid password");

      const token = jwt.sign(
        {
          user_id: userData.user_id,
        },
        config.TOKEN_SECRET
      );

      if (!token) throw new Error("Error signing token");

      const tokenCookie = cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV
          ? process.env.NODE_ENV.toString() == "production"
          : false,
        sameSite: "strict",
        path: "/",
      });

      context.response.setHeader("Set-Cookie", tokenCookie);

      return token;
    },

    register: async (_parent, args, _context) => {
      if (
        !args.data ||
        !args.data.email ||
        !args.data.password ||
        !args.data.username
      )
        throw new Error("Email or password is missing");

      const hash = bcrypt.hashSync(args.data.email, 2);

      const createdUser = await db.user.create({
        data: {
          email: args.data.email.toString(),
          password: createPassword(args.data.password.toString()),
          username: args.data.username.toString(),
          hash: hash.toString(),
        },
      });

      if (!createdUser) throw new Error("Error creating user");

      return "Success";
    },
  },
};
