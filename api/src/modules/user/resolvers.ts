import { AuthenticationError } from "apollo-server-errors";
import { ResolverContext } from "../../context";
import { Resolvers } from "../../graphql/types";
import { db } from "../../database";
import { verifyPassword, createPassword, getUserByPublicId } from "./helpers";
import { check } from "../../functions/check";
import { defaultPriorities } from "../todo/helpers";

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

        if (userData.status !== "ACTIVE") throw new Error("User is not active");

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

        try {
          await db.priority.createMany({
            data: [
              {
                name: "Baixa",
                color: "#00bcd4",
                userId: createdUser.user_id,
                order: 1,
              },
              {
                name: "Mediana",
                color: "#ff9800",
                userId: createdUser.user_id,
                order: 2,
              },
              {
                name: "Alta",
                color: "#f44336",
                userId: createdUser.user_id,
                order: 3,
              },
            ],
          });
        } catch (e) {}

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
    updateUser: async (_, { email }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("User not logged in");

      try {
        interface IDataToUpdate {
          email?: string;
        }

        const dataToUpdate: IDataToUpdate = {};

        if (email) dataToUpdate.email = email;

        const user = await db.user.update({
          where: {
            public_user_id: user_id,
          },
          data: dataToUpdate,
        });

        if (!user) throw new Error("Error updating user");

        return true;
      } catch (e) {
        throw new Error(e as string);
      }
    },
    updatePassword: async (
      _,
      { oldPassword, newPassword },
      { is_authed, user_id }
    ) => {
      if (!is_authed || !user_id) throw new Error("User not logged in");

      try {
        const validPassword = check.chars.password(newPassword);

        const user = await db.user.findUnique({
          where: {
            public_user_id: user_id,
          },
        });

        if (!user) throw new Error("User not found");

        const isPasswordCorrect = await verifyPassword(
          oldPassword,
          user.password
        );

        if (!isPasswordCorrect) throw new Error("Invalid password");

        const updatedUser = await db.user.update({
          where: {
            public_user_id: user_id,
          },
          data: {
            password: await createPassword(validPassword),
          },
        });

        if (!updatedUser) throw new Error("Error updating user");

        return true;
      } catch (e) {
        throw new Error(e as string);
      }
    },
    deactivateUser: async (_, { password }, { is_authed, user_id }) => {
      if (!is_authed || !user_id) throw new Error("User not logged in");

      try {
        const user = await db.user.findUnique({
          where: {
            public_user_id: user_id,
          },
        });

        if (!user) throw new Error("User not found");

        const isPasswordCorrect = await verifyPassword(password, user.password);

        if (!isPasswordCorrect) throw new Error("Invalid password");

        const updatedUser = await db.user.update({
          where: {
            public_user_id: user_id,
          },
          data: {
            status: "INACTIVE",
          },
        });

        if (!updatedUser) throw new Error("Error deactivating user");

        return true;
      } catch (e) {
        throw new Error(e as string);
      }
    },
  },
};
