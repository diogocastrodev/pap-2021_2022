import { AuthenticationError } from "apollo-server-errors";
import { ResolverContext } from "../../context";
import { Resolvers } from "../../graphql/types";
import { db } from "../../database";
import {
  verifyPassword,
  createPassword,
  getUserByPublicId,
  createHash,
} from "./helpers";
import * as jwt from "jsonwebtoken";
import { config } from "../../utils";

// @ts-ignore
import cookie from "cookie";
// @ts-ignore
import bcrypt from "bcrypt";

// TODO: Add context to resolver
export const UserResolvers: Resolvers<ResolverContext> = {
  Query: {
    me: async (_parent, _args, context) => {
      if (!context.is_authed || !context.user_id)
        throw new AuthenticationError("no login");

      const user = await getUserByPublicId(context.user_id.toString());

      if (!user) throw new Error("User not found");

      return user;
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
          user_id: userData.public_user_id,
        },
        config.TOKEN_SECRET
      );

      if (!token) throw new Error("Error signing token");

      context.request.session.is_logged = true;
      context.request.session.public_user_id = userData.public_user_id;

      context.request.session.save();

      //createSessionInDb(context.request.session.id, userData.public_user_id);

      /* console.log(context.request.session); */

      return true;
    },

    register: async (_parent, args, _context) => {
      if (!args.data || !args.data.email || !args.data.password)
        throw new Error("Email or password is missing");

      const hash = await createHash(args.data.email);

      const createdUser = await db.user.create({
        data: {
          email: args.data.email.toString(),
          password: await createPassword(args.data.password.toString()),
          hash: hash.toString(),
        },
      });

      if (!createdUser) throw new Error("Error creating user");

      return true;
    },
    logout: async (_parent, _args, context) => {
      if (!context.is_authed || !context.user_id)
        throw new Error("User not logged in");

      context.request.session.destroy((err) => {
        if (err) throw new Error(err);
      });

      return true;
    },
  },
};
