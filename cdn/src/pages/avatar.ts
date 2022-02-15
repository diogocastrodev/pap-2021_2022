import { pathName, pathNameForPaths } from "../services/uploadAvatarService";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export function avatarPage (req: Request, res: Response) {
    if(req.params.folder) {
        fs.readdir(path.join(pathName, req.params.folder), (err, files) => {
            if(typeof files !== "undefined" && files.length > 0) {
                /* Has files */
                res.sendFile(path.join(__dirname, pathNameForPaths + req.params.folder + '/' + files[0]));

            } else {
                /* No files */
                res.sendStatus(204)
            }
        })
  } else {
      res.sendStatus(404);
  }
}