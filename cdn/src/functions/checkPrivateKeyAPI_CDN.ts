import { config } from "../utils";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

export default async function checkPrivateKeyAPI_CDN(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const privateKey = req.headers.authorization as string;

  if (privateKey && privateKey === config.API_CDN_Private_Key) {
    next();
  } else {
    res
      .status(401)
      .json({
        error: "Unauthorized",
      })
      .end();
  }
}
