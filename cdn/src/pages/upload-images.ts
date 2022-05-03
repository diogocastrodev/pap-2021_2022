import { Request, Response } from 'express';

export async function UploadImages(req: Request, res: Response) {
    if(req.files && req.body) {

        const files = req.files as Express.Multer.File[];

        const fileNameArray: Array<string> = [];

        files.map(file => {
            fileNameArray.push(file.destination.split('\\').pop() + "/" + file.filename);
        })

        res.status(200).json({
            fileNames: fileNameArray,
        });
        
    } else {
        res.status(400).json({
            error: 'No files were uploaded.'
        });
    }
}