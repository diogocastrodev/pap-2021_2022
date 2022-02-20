import { ResolverContext } from "../../context";
import { Resolvers, UserStatus } from "../../graphql/types";
import { db } from "../../database";
import { verifyPassword, createPassword, getUserIDByPublicID } from "./helpers";
import * as jwt from "jsonwebtoken";
import { config } from "../../utils";
import { sendEmail } from "../../libs/emailSender";
import { v4 } from "uuid";
import cookie from "cookie";

// TODO: Add context to resolver
export const UserResolvers: Resolvers<ResolverContext> = {
  Query: {
    me: async (_parent, _args, context) => {
      if (!context.is_authed || !context.public_id) throw new Error("no login");

      const userData = await db.user.findUnique({
        where: {
          public_user_id: context.public_id,
        },
      });

      if (!userData) throw new Error("User not found");

      return userData;
    },
    checkToken: async (_parent, _args, context) => {
      return context.is_authed;
    },
    profile: async (_parent, args, _context) => {
      if (!args.id) throw new Error("No id provided");

      const userId = await getUserIDByPublicID(args.id);

      const userData = await db.user.findUnique({
        where: {
          user_id: userId,
        },
        select: {
          avatar: true,
          email: true,

          haveAvatar: true,

          name: true,
          surname: true,

          product: {
            where: {
              product_status: "ACTIVE",
            },
            include: {
              product_images: true,
            },
          },
        },
      });

      if (!userData) throw new Error("User not found");

      return userData;
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

      if (userData.status === UserStatus.Pending) throw new Error("Pending");

      if (userData.status === UserStatus.Inactive) throw new Error("Inactive");

      const token = jwt.sign(
        {
          public_id: userData.public_user_id,
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
        !args.data.name ||
        !args.data.surname
      )
        throw new Error("Email or password is missing");

      const hash = v4();

      const createdUser = await db.user.create({
        data: {
          email: args.data.email.toString(),
          password: createPassword(args.data.password.toString()),
          name: args.data.name.toString(),
          surname: args.data.surname.toString(),
          phone_number: args.data.phone_number ? args.data.phone_number : null,
          hash: hash,
        },
      });

      if (!createdUser) throw new Error("Error creating user");

      const sentEmail = await sendEmail(
        createdUser.email,
        "Email Verification",
        {
          text: `Verify your email using: ${
            config.FRONTEND_SSL ? "https" : "http"
          }://${config.FRONTEND_URL}/auth/email/${createdUser.hash}`,
          html: `Verify your email using: ${
            config.FRONTEND_SSL ? "https" : "http"
          }://${config.FRONTEND_URL}/auth/email/${createdUser.hash}`,
        }
      );

      return "Success";
    },
    verifyEmail: async (_parent, args, _context) => {
      if (!args.hash) throw new Error("No hash provided");

      try {
        const userData = await db.user.update({
          where: {
            hash: args.hash,
          },
          data: {
            status: UserStatus.Active,
            emailVerified: true,
          },
        });
      } catch (error) {
        throw new Error("Error verifying email");
      }

      return "Success";
    },
    /* Update User */
  },
};
