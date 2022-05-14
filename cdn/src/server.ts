import express from "express";
import cors, { CorsOptions } from "cors";

import { config } from "./utils";

import { UploadAvatar } from "./pages/upload-avatar";
import { UploadImages } from "./pages/upload-images";
import { upload as uploadImages } from "./services/uploadImagesService";
import { upload as uploadAvatar } from "./services/uploadAvatarService";
import { imagesPage } from "./pages/images";
import { avatarPage } from "./pages/avatar";
import checkPrivateKeyAPI_CDN from "./functions/checkPrivateKeyAPI_CDN";

const app = express();

app.use(cors());

const corsOptions: CorsOptions = {
  origin: ["http://localhost:4000", "http://51.68.197.137:4000/"],
};

app.post(
  "/upload/images",
  cors(corsOptions),
  checkPrivateKeyAPI_CDN,
  uploadImages.array("images"),
  UploadImages
);

app.use("/images/upload/:pubUserId/:id", imagesPage);

app.use((req, res, next) => {
  res.status(404).end();
});

app.listen(config.port, () => {
  console.log(`🚀 Server started at http://localhost:${config.port}`);
});

// prevent from crashing
process.on("uncaughtException", (err) => {
  console.log(err);
});
