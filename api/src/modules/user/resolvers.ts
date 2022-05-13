import { AuthenticationError } from "apollo-server-errors";
import { ResolverContext } from "../../context";
import { Resolvers } from "../../graphql/types";
import { db } from "../../database";
import { verifyPassword, createPassword, getUserByPublicId } from "./helpers";

// TODO: Add context to resolver
export const UserResolvers: Resolvers<ResolverContext> = {
  Query: {
    me: async (_, __, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new AuthenticationError("no login");

      try {
        const user = await db.user.findUnique({
          where: {
            public_user_id: user_id,
          },
          include: {
            todo: {
              include: {
                priority: true,
                files: true,
              },
            },
            priority: true,
            folders: {
              include: {
                files: {
                  include: {
                    document: true,
                    todos: true,
                  },
                },
              },
            },
          },
        });

        if (!user) throw new Error("User not found");

        return user;
      } catch (e) {
        throw new Error(e as string);
      }
    },
    checkToken: async (_, __, context) => {
      return context.is_authed;
    },
  },
  Mutation: {
    login: async (_, { email, password }, { is_authed, user_id, request }) => {
      if (is_authed && user_id)
        throw new AuthenticationError("already logged in");

      const userData = await db.user.findUnique({
        where: {
          email: email.toString(),
        },
      });

      if (!userData) throw new Error("User not found");

      const isPasswordValid = verifyPassword(password, userData.password);

      if (!isPasswordValid) throw new Error("Invalid password");

      /* const token = jwt.sign(
        {
          user_id: userData.public_user_id,
        },
        config.TOKEN_SECRET
      );

      if (!token) throw new Error("Error signing token"); */

      request.session.is_logged = true;
      request.session.public_user_id = userData.public_user_id;

      request.session.save();

      //createSessionInDb(context.request.session.id, userData.public_user_id);

      /* console.log(context.request.session); */

      return true;
    },

    register: async (_, { email, password }, { is_authed, user_id }) => {
      if (is_authed && user_id)
        throw new AuthenticationError("already logged in");

      const createdUser = await db.user.create({
        data: {
          email: email.toString(),
          password: await createPassword(password.toString()),
        },
      });

      if (!createdUser) throw new Error("Error creating user");

      return true;
    },
    logout: async (_, __, { is_authed, user_id, request }) => {
      if (!is_authed || !user_id) throw new Error("User not logged in");

      request.session.destroy((err) => {
        if (err) throw new Error(err);
      });

      return true;
    },
  },
};
