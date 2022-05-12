import express, { Request, Response, Router } from "express";

import { checkLogin } from "./libs/checkLogin";

import { uploadImages } from "./services/uploadImagesService";
import { imageUpload } from "./controllers/imageUpload";

export const router = Router();

// Debug
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("API is alive ✅");
});

router.post(
  "/upload/images",
  checkLogin,
  uploadImages.array("images", 30),
  imageUpload
);
