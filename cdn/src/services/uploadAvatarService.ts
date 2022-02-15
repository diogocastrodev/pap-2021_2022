import { maxSizePerImage, supportedTypes } from "../utils";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";

function fileFilter (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {

    if(
        file.mimetype.split("/")[0] === "image" &&
        supportedTypes.includes(file.mimetype.split("/")[1].toLowerCase()) &&
        typeof req.body.publicId === "string"
     ) {
        cb(null, true);
    } else {
        cb(null, false);
        console.log(`✨ Avatar ✨ Attempt to upload the file: ${file.originalname} (${file.size}) failed`);
    }
  
  }

  
  export const pathName = "images/user/";
  export const pathNameForPaths = "../../" + pathName;

  const storage = multer.diskStorage({
      
      destination: (req, file, cb) => {
        const finalPathName = path.join( 
            __dirname, 
            pathNameForPaths, 
            req.body.publicId
            );

        fs.mkdir(path.resolve(__dirname, finalPathName), { recursive: true }, e => {
            if (e) {
                console.error(e);
            } else {
                cb(null, path.resolve(__dirname, finalPathName))
            }
         });

         fs.readdir(path.join(pathName, req.body.publicId), (err, files) => {
            if(typeof files !== "undefined" && files.length > 0) {
                /* Has files */
                fs.unlink(path.join(__dirname, pathNameForPaths, req.body.publicId, files[0]), e => {
                    if(e) {
                        console.error(e);
                    }
                });
            }
         })
    },
    filename: (req, file, cb) => {
        const fileExtension = file.mimetype.split("/")[1];
        if(supportedTypes.includes(fileExtension)) {
            const fileName = `avatar.${fileExtension}`;
            cb(null, fileName);
        } else {
            cb(new Error('File type not supported or too big'), fileExtension);
        }
    },
});

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: maxSizePerImage,
    },
});