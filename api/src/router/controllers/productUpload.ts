import { Request, Response } from "express";
import axios from "axios";
import { config } from "../../utils";
import fs from "fs";
import { pathName, pathNameForPaths } from "../services/uploadProductsService";
import { context } from "../../context";
import FormData from "form-data";
import path from "path";
import { db } from "../../database";
import { ProductSellType } from "../../graphql/types";
import folderDestroyer from "../helpers/folderDestroyer";

export async function productUpload(req: Request, res: Response) {
  if (req.files && req.body) {
    const files = req.files as Express.Multer.File[];

    if (
      !req.body.title &&
      !req.body.titleExtraInfo &&
      !req.body.description &&
      !req.body.location &&
      !req.body.sellType &&
      !req.body.price
    )
      throw new Error("Missing fields");

    try {
      let fileNames: string[] = [];

      files.forEach((file) => {
        fileNames.push(
          file.destination.split("\\").pop() + "/" + file.filename
        );
      });

      if (fileNames.length === 0) throw new Error("No files were uploaded");

      const ctx = await context({ req, res });

      if (!ctx.public_id || typeof ctx.public_id !== "string")
        throw new Error("No public_id was found");

      /* Creating Product */
      const product = await db.product.create({
        data: {
          title: req.body.title as string,
          titleExtraInfo: req.body.titleExtraInfo as string,
          description: req.body.description as string,
          location: req.body.location as string,
          sellType: req.body.sellType as ProductSellType,
          price: parseFloat(req.body.price as string),
          user: {
            connect: {
              public_user_id: ctx.public_id as string,
            },
          },
        },
        select: {
          product_id: true,
        },
      });

      if (!product || typeof product === "undefined")
        throw new Error("Product not created");

      const formData = new FormData();

      formData.append("productId", product?.product_id);
      for (let i = 0; i < fileNames.length; i++) {
        formData.append(
          "images",
          fs.createReadStream(`${pathName}/${fileNames[i]}`)
        );
      }

      /* TODO: http:// */
      axios({
        method: "POST",
        url: `http://${config.CDN_URL}/upload/images`,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
          Authorization: `${config.API_CDN_Private_Key}`,
        },
        data: formData,
      })
        .then(async (response) => {
          folderDestroyer({
            files,
            pathToFolder: pathNameForPaths,
          });
          if (response.status === 200) {
            await db.product_images.createMany({
              data: response.data.fileNames.map((image: string) => ({
                product_id: product?.product_id as string,
                image_url: image,
              })),
            });

            await db.product.update({
              where: {
                product_id: product?.product_id as string,
              },
              data: {
                haveImages: true,
              },
            });

            res.status(200).json({
              productId: product?.product_id as string,
            });
          }
        })
        .catch((error) => {
          folderDestroyer({
            files,
            pathToFolder: pathNameForPaths,
          });

          throw new Error(error);
        });
    } catch (e: any) {
      folderDestroyer({
        files,
        pathToFolder: pathNameForPaths,
      });

      throw new Error(e);
    }
  } else {
    throw new Error("No Files/Body");
  }
}
