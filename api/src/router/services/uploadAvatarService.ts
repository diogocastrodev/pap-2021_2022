import { config } from "../../utils";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";
import shortid from "shortid";

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  if (
    file.mimetype.split("/")[0] === "image" &&
    config.images.allowedTypes.includes(
      file.mimetype.split("/")[1].toLowerCase()
    )
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    console.log(
      `✨ Avatar ✨ Attempt to upload the file: ${file.originalname} (${file.size}) failed`
    );
  }
}

export const pathName = "tmp/avatar";
export const pathNameForPaths = "../../../" + pathName;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id = shortid.generate();

    const finalPathName = path.join(__dirname, pathNameForPaths, id);

    fs.mkdir(
      path.resolve(__dirname, finalPathName),
      { recursive: true },
      (e) => {
        if (e) {
          console.error(e);
        } else {
          cb(null, path.resolve(__dirname, finalPathName));
        }
      }
    );

    fs.readdir(path.join(pathName, id), (err, files) => {
      if (typeof files !== "undefined" && files.length > 0) {
        /* Has files */
        fs.unlink(path.join(__dirname, pathNameForPaths, id, files[0]), (e) => {
          if (e) {
            console.error(e);
          }
        });
      }
    });
  },
  filename: (req, file, cb) => {
    const fileExtension = file.mimetype.split("/")[1];
    if (config.images.allowedTypes.includes(fileExtension)) {
      const fileName = `avatar.${fileExtension}`;
      cb(null, fileName);
    } else {
      cb(new Error("File type not supported or too big"), fileExtension);
    }
  },
});

export const uploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.images.avatar.maxSize,
  },
});