// @ts-ignore
import bcrypt from "bcrypt";
import { db } from "../../database";

export const createPassword = (pwd: string): string => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pwd, salt);
  return hash;
};

export const verifyPassword = (pwd: string, hash: string): boolean => {
  return bcrypt.compareSync(pwd, hash);
};

export const getUserByPublicId = async (publicId: string) => {
  const user = await db.user.findUnique({
    where: {
      public_user_id: publicId,
    },
  });

  return user;
};
