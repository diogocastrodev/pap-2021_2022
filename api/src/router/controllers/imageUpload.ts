import { Request, Response } from "express";
import axios from "axios";
import { config } from "../../utils";
import fs from "fs";
import { pathName, pathNameForPaths } from "../services/uploadImagesService";
import { context } from "../../context";
import FormData from "form-data";
import folderDestroyer from "../helpers/folderDestroyer";
import { cdnImages } from "@prisma/client";
import { db } from "../../database";

export async function imageUpload(req: Request, res: Response) {
  if (req.files) {
    const files = req.files as Express.Multer.File[];

    try {
      if (files.length === 0) {
        res.status(400).json({
          error: "No files were uploaded.",
        });
      }

      const ctx = await context({ req, res });

      if (!ctx.is_authed || !ctx.user_id)
        throw new Error("No public_id was found");

      const formData = new FormData();

      formData.append("pubUserId", ctx.user_id);
      files.map((file) => {
        formData.append("images", fs.createReadStream(file.path));
      });

      await axios({
        method: "POST",
        url: `${config.CDN.URL}/upload/images`,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
          Authorization: `${config.CDN.KEY}`,
        },
        data: formData,
      })
        .then(async (response) => {
          folderDestroyer({
            files,
          });
          if (response.status === 200) {
            let imgs = response.data.fileNames as cdnImages[];
            if (imgs.length > 0) {
              try {
                const getUserId = await db.user.findUnique({
                  where: {
                    public_user_id: ctx.user_id,
                  },
                  select: {
                    user_id: true,
                  },
                });

                if (!getUserId) {
                  throw new Error("User not found");
                }

                // Add the user_id to imgs
                for (let i = 0; i < imgs.length; i++) {
                  imgs[i] = {
                    ...imgs[i],
                    user_id: getUserId.user_id,
                  };
                }

                const storedImages = await db.cdnImages.createMany({
                  data: imgs,
                });

                console.log("✨ Images ✨ Uploaded successfully");

                if (storedImages.count > 0) {
                  res.status(200).json({
                    data: storedImages,
                  });
                }
              } catch (e) {
                console.log(e);
              }
            }
          }
        })
        .catch((e) => {
          console.log(e);
          folderDestroyer({
            files,
          });

          throw new Error(e as string);
        });
    } catch (e) {
      folderDestroyer({
        files,
      });
      throw new Error(e as string);
    }
  } else {
    throw new Error("No Files/Body");
  }
}
