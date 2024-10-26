import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as path from 'path';
import { AppConfig } from 'src/config/app.config';
import { FileStorageService } from '../file-storage/file-storage.service';

@Injectable()
export class FileStreamingService {
    constructor(private readonly storage: FileStorageService) { }

    async fileList(res: Response) {
        return await this.storage.allFilesFromPublic(res)
    }
    async readFile(fileName: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>> {

        const file = await this.storage.viewFromPublic(fileName, req, res)
        return file;
    }
    async readFolders(): Promise<{ folders: string[]; }> {
        try {
            const file = await this.storage.getFolders();
            return { folders: file }
        } catch (error) {
            console.log
                ({ message: 'Failed to read MPD file chunk', error: error.message });
            return { folders: null }
        }


        // const dirName = `public/videos/ffmpeg/Cutemp4.mp4`
        // const videoPath = path.join(process.cwd(), dirName, stream);
        // res.sendFile(videoPath);
    }
    async readMpdFile(stream: string, fileName: string, isLocal: string, req: Request, res: Response) {

        if (isLocal == 'true') {
            console.log("called for mpd");
            const filePath = path.join(process.cwd(), `public/videos/ffmpeg/${fileName}/${stream}`);
            res.sendFile(filePath);
        }
        else {

            try {
                const fileKey = `${fileName}/${stream}`; // Assuming MPD file path
                const file = await this.storage.getFile(AppConfig.MINIO_BUCKET_NAME, fileKey);

                // Set headers for MPD (MPEG-DASH) file
                res.set({
                    'Content-Type': 'application/dash+xml', // MIME type for MPD
                    'Content-Disposition': `inline; filename="${stream}.m4s"`,
                });

                // Pipe the file stream to the response
                (file.Body as any).pipe(res); // TypeScript type might require casting here
            } catch (error) {
                res.status(500).json({ message: 'Failed to read MPD file chunk', error: error.message });
            }
        }


    }
    async readMpdChunk(fileName: string, isLocal: string, req: Request, res: Response) {

        if (isLocal == 'true') {

            console.log("called for mpd");
            const filePath = path.join(process.cwd(), `public/videos/ffmpeg/${fileName}/output.mpd`);
            // const filePath = path.join(__dirname, 'public/videos/ffmpeg', fileName, 'video.mpd');
            res.sendFile(filePath);
        }
        else {
            try {
                const fileKey = `${fileName}/output.mpd`; // Assuming MPD file path
                const file = await this.storage.getFile(AppConfig.MINIO_BUCKET_NAME, fileKey);

                // Set headers for MPD (MPEG-DASH) file
                res.set({
                    'Content-Type': 'application/dash+xml', // MIME type for MPD
                    'Content-Disposition': `inline; filename="${fileName}.mpd"`,
                });

                // Pipe the file stream to the response
                (file.Body as any).pipe(res); // TypeScript type might require casting here
            } catch (error) {
                res.status(500).json({ message: 'Failed to read MPD file chunk', error: error.message });
            }
        }

    }
}
