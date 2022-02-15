import express, { Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";

import { avatarUpload } from "./controllers/avatarUpload";
import { productUpload } from "./controllers/productUpload";

import { checkLogin } from "./libs/checkLogin";

import { context } from "../context";
import { schema } from "../modules";
import { uploadAvatar } from "./services/uploadAvatarService";
import { sendEmail } from "../libs/emailSender";

export const router = express.Router();

// Debug
router.get("/", (req: Request, res: Response) => {
  res.json({
    teste: "teste",
  });
});

/* GraphQL */

/* Image Upload */
router.post(
  "/upload/avatar",
  checkLogin,
  uploadAvatar.single("avatar"),
  avatarUpload
);
router.post("/upload/products", checkLogin, /* TODO: Multer */ productUpload);

router.get("/send", async (req, res) => {
  res.status(200).json({
    message: "Email sent",
  });
});

/* 404 when page doesn't exist */
router.use("*", (req: Request, res: Response) => {
  res.status(404).end();
});
