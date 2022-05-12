import { maxSizePerImage, supportedTypes } from "../utils";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  if (
    file.mimetype.split("/")[0] === "image" &&
    supportedTypes.includes(file.mimetype.split("/")[1].toLowerCase()) &&
    typeof req.body.pubUserId === "string"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    console.log(
      `✨ Images ✨ Attempt to upload the file: ${file.originalname} | type: ${file.mimetype} (${file.size}) failed`
    );
  }
}

export const pathName = "images/uploads/";
export const pathNameForPaths = "../../" + pathName;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const finalPathName = path.join(
      __dirname,
      pathNameForPaths,
      req.body.pubUserId
    );

    fs.mkdir(
      path.resolve(__dirname, finalPathName),
      { recursive: true },
      (e) => {
        if (e) {
          cb(new Error("Error creating folder"), "");
        } else {
          cb(null, path.resolve(__dirname, finalPathName));
        }
      }
    );
  },
  filename: (req, file, cb) => {
    const fileExtension = file.mimetype.split("/")[1];
    if (supportedTypes.includes(fileExtension)) {
      const fileName = `${Date.now()}-${uuidv4().toString()}.${fileExtension}`;
      cb(null, fileName);
    } else {
      cb(new Error("File type not supported or too big"), fileExtension);
    }
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxSizePerImage,
  },
});
