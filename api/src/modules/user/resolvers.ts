import { AuthenticationError } from "apollo-server-errors";
import { ResolverContext } from "../../context";
import { Resolvers } from "../../graphql/types";
import { db } from "../../database";
import { verifyPassword, createPassword, getUserByPublicId } from "./helpers";
import { check } from "../../functions/check";

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
        });

        if (!user) throw new Error("User not found");

        return user;
      } catch (e) {
        throw new Error(e as string);
      }
    },
    checkToken: async (_, __, { is_authed }) => {
      return is_authed;
    },
  },
  Mutation: {
    login: async (_, { email, password }, { is_authed, user_id, request }) => {
      if (is_authed && user_id)
        throw new AuthenticationError("already logged in");

      const defaultError = "Invalid email or password";
      try {
        const userData = await db.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!userData) throw new Error(defaultError);

        /* -------------------------------------------------------------------------- */
        /*                            Ver se isto funciona                            */
        /* -------------------------------------------------------------------------- */
        const isPasswordCorrect = await verifyPassword(
          password,
          userData.password
        );

        if (!isPasswordCorrect) throw new Error(defaultError);

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

        return true;
      } catch (e) {
        throw new Error(defaultError);
      }
    },

    register: async (_, { email, password }, { is_authed, user_id }) => {
      if (is_authed && user_id)
        throw new AuthenticationError("already logged in");
      try {
        const validEmail = check.chars.email(email);
        const validPassword = check.chars.password(password);

        const createdUser = await db.user.create({
          data: {
            email: validEmail,
            password: await createPassword(validPassword),
          },
        });

        if (!createdUser) throw new Error("Error creating user");

        return true;
      } catch (e) {
        throw new Error(e as string);
      }
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
