import { Request, Response } from "express";
import { pathName } from "../services/uploadImagesService";

interface IUploadImages {
  name: string;
  path: string;
  type: string;
  pathWithName: string;
}

export async function UploadImages(req: Request, res: Response) {
  if (req.files && req.body) {
    const files = req.files as Express.Multer.File[];

    const fileNameArray: IUploadImages[] = [];

    files.map((file) => {
      fileNameArray.push({
        name: file.originalname,
        path: pathName + req.body.pubUserId,
        type: file.mimetype,
        pathWithName: pathName + req.body.pubUserId + "/" + file.filename,
      });
    });

    res.status(200).json({
      fileNames: fileNameArray,
    });
  } else {
    res.status(400).json({
      error: "No files were uploaded.",
    });
  }
}
