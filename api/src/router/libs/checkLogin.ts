import { NextFunction, Request, Response } from "express";
import { context } from "../../context";

export async function checkLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ctx = await context({ req, res });

  /* Check if user's authed */
  if (
    ctx.is_authed &&
    typeof ctx.is_authed !== "undefined" &&
    ctx.user_id &&
    typeof ctx.user_id !== "undefined"
  ) {
    next();
  } else {
    res.status(401).send("Unauthorized").end();
  }
}
