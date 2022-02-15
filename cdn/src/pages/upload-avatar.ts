import { Request, Response } from "express";

export function UploadAvatar(req: Request, res: Response) {
  if (req.file && req.body) {
    const file = req.file as Express.Multer.File;

    const fileName: string =
      file.destination.split("\\").pop() + "/" + file.filename;

    res.status(200).json({
      fileName: fileName,
    });
  } else {
    res.status(400).json({
      error: "No files were uploaded.",
    });
  }
}
