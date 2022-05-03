import { pathNameForPaths } from "../services/uploadImagesService";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export function imagesPage (req: Request, res: Response) {
  if(req.params.folder && req.params.id) {
      if(fs.existsSync("images/products/" + req.params.folder + "/" + req.params.id)) {
          res.sendFile(path.join(__dirname, pathNameForPaths + req.params.folder + '/' + req.params.id));
      } else {
          res.sendStatus(404);
      }
  } else {
      res.sendStatus(404);
  }
}