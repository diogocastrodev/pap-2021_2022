import fs from "fs";
import path from "path";

interface props {
  pathToFolder: string;
  files: Express.Multer.File | Express.Multer.File[];
}

export default function folderDestroyer({ pathToFolder, files }: props) {
  if (Array.isArray(files)) {
    files.forEach((file) => {
      fs.unlink(path.join(file.path), (err) => {
        if (err) {
          console.error(err);
        }
      });
      fs.rmSync(file.destination, { recursive: true });
    });
  } else {
    fs.unlink(path.join(files.path), (err) => {
      if (err) {
        console.error(err);
      }
    });
    fs.rmSync(files.destination, { recursive: true });
  }
}
