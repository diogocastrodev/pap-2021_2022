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
    config.images.types.includes(file.mimetype.split("/")[1].toLowerCase())
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    console.log(
      `✨ Products ✨ Attempt to upload the file: ${file.originalname} | type: ${file.mimetype} (${file.size}) failed`
    );
  }
}

export const pathName = "tmp/images";
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
    const id = shortid.generate();
    const fileExtension = file.mimetype.split("/")[1];
    if (config.images.types.includes(fileExtension)) {
      const fileName = `${id}.${fileExtension}`;
      cb(null, fileName);
    } else {
      cb(new Error("File type not supported or too big"), fileExtension);
    }
  },
});

export const uploadImages = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.images.maxSize,
  },
});
