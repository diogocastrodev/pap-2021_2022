// @ts-ignore
import bcrypt from "bcrypt";
import { db } from "../../database";
import argon2 from "argon2";
import { config } from "../../utils";
import { User } from "../../graphql/types";
import { user } from "@prisma/client";

const argon2Config: argon2.Options & {
  raw?: false | undefined;
} = {};

export const createPassword = async (pwd: string): Promise<string> => {
  try {
    const hashHashed = await argon2.hash(pwd, argon2Config);
    return hashHashed;
  } catch (err) {
    throw new Error(err as string);
  }
};

export const verifyPassword = async (
  pwd: string,
  hash: string
): Promise<boolean> => {
  try {
    if (await argon2.verify(hash, pwd, argon2Config)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(err as string);
  }
};

export const createHash = async (msgToHash: string): Promise<string> => {
  try {
    const hash = await argon2.hash(msgToHash, argon2Config);
    return hash;
  } catch (err) {
    throw new Error(err as string);
  }
};

export const verifyHash = async (
  hash: string,
  hashToVerify: string
): Promise<boolean> => {
  try {
    if (await argon2.verify(hashToVerify, hash, argon2Config)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(err as string);
  }
};

export const getUserByPublicId = async (publicId: string): Promise<user> => {
  const user = await db.user.findUnique({
    where: {
      public_user_id: publicId,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};
