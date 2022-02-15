import { Request, Response } from "express";
import axios from "axios";
import { config } from "../../utils";
import fs from "fs";
import { pathName, pathNameForPaths } from "../services/uploadAvatarService";
import { Blob } from "buffer";
import { context } from "../../context";
import FormData from "form-data";
import path from "path";
import { db } from "../../database";

export async function avatarUpload(req: Request, res: Response) {
  /* TODO: Avatar Upload */
  if (req.file && req.body) {
    const file = req.file as Express.Multer.File;

    const fileName: string =
      file.destination.split("\\").pop() + "/" + file.filename;

    const formData = new FormData();

    const ctx = await context({ req, res });

    formData.append("publicId", ctx.public_id as string);

    formData.append("avatar", fs.createReadStream(`${pathName}/${fileName}`));

    axios({
      method: "POST",
      url: `http://${config.CDN_URL}/upload/avatar`,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
        Authorization: `${config.API_CDN_Private_Key}`,
      },
      data: formData,
    })
      .then(async (response) => {
        fs.rm(
          path.resolve(__dirname, pathNameForPaths, file.destination),
          { recursive: true },
          (e) => {
            if (e) {
              console.error(e);
            }
          }
        );
        if (response.status === 200) {
          await db.user.update({
            where: {
              public_user_id: ctx.public_id,
            },
            data: {
              haveAvatar: true,
              avatar: response.data.fileName as string,
            },
          });

          res.status(200).json({
            msg: "Success!",
          });
        }
      })
      .catch((error) => {
        fs.rm(
          path.resolve(__dirname, pathNameForPaths, file.destination),
          { recursive: true },
          (e) => {
            if (e) {
              console.error(e);
            }
          }
        );

        res.status(400).json({
          msg: error,
        });
      });
  } else {
    res.status(400).json({
      error: "No files were uploaded.",
    });
  }
}
