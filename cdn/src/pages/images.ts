import { pathName, pathNameForPaths } from "../services/uploadImagesService";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export function imagesPage(req: Request, res: Response) {
  if (req.params.pubUserId && req.params.id) {
    if (fs.existsSync(pathName + req.params.pubUserId + "/" + req.params.id)) {
      res.sendFile(
        path.join(
          __dirname,
          pathNameForPaths + req.params.pubUserId + "/" + req.params.id
        )
      );
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
}
