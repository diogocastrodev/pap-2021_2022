import fs from "fs";
import path from "path";
import { pathNameForPaths } from "../services/uploadImagesService";

interface props {
  files: Express.Multer.File | Express.Multer.File[];
}

export default function folderDestroyer({ files }: props) {
  if (Array.isArray(files)) {
    files.forEach((file) => {
      fs.unlinkSync(path.resolve(file.path));
    });

    files.forEach((file) => {
      fs.rmSync(path.resolve(file.destination), {
        recursive: true,
        force: true,
      });
    });
  } else {
    /* fs.unlink(path.join(files.path), (err) => {
      if (err) {
        console.error(err);
        throw new Error(err.message);
      }
    }); */
    console.log("teste");
    // fs.rmSync(files.destination, { recursive: true });
  }
}
