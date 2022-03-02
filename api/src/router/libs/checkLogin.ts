import { NextFunction, Request, Response } from "express";
import { context } from "../../context";

export async function checkLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ctx = await context({ req, res });

  /* Check if user's authed */
  if (!ctx.is_authed || !ctx.public_id || typeof ctx.public_id === "undefined")
    res.status(401).send("Unauthorized");

  /* User authenticated */
  next();
}
