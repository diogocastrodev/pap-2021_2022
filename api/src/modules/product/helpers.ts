import { createWriteStream } from "fs";
import { parse } from "path";
import { FileUpload } from "../../utils";

export async function multipleFileUpload (file: FileUpload[]) {
    let fileUrl = [];
    for(let i = 0; i < file.length; i++) {
        const { createReadStream, filename } = await file[i];
        const stream = createReadStream();
        stream.
    }
}