import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { AppConfig } from 'src/config/app.config';
import { FileStorageService } from '../file-storage/file-storage.service';
import { VideoProcessingService } from './../video-processing-service/video-processing-service.service';

@Injectable()
export class FileUploadService {
    constructor(
        private readonly storage: FileStorageService,
        private readonly videoProcessingService: VideoProcessingService
    ) { }


    async upload(file: Express.Multer.File): Promise<{ fileName: string; }> {
        const uploadedFile = await this.storage.handleFile(file, 'video', 'direct');
        return uploadedFile;
    }

    async uploadByStream(file: Express.Multer.File): Promise<{ fileName: string; }> {
        const uploadedFile = await this.storage.handleFile(file, 'video', 'stream');
        await this.convertToDashAndSaveToPublic(uploadedFile);
        return uploadedFile;
    }
    async uploadFileByffmpeg(file: Express.Multer.File): Promise<{ manifestUrl: string; uploadedFile: { fileName: string; }; }> {
        const uploadedFile = await this.storage.handleFile(file, 'video', 'stream');
        const ffmpegFilesPath = await this.convertToDashAndSaveToPublic(uploadedFile);

        // Upload DASH files to S3
        const s3Bucket = AppConfig.minio_bucket_name;
        const s3KeyPrefix = `${(uploadedFile?.fileName).split(".")[0]}`;

        await this.storage.uploadFfmpegFolder(s3Bucket, ffmpegFilesPath, s3KeyPrefix);

        // Return the DASH manifest URL
        const manifestUrl = `https://${s3Bucket}.s3.amazonaws.com/${s3KeyPrefix}/output.mpd`;

        const delPath = 'public/videos'
        const curr2 = process.cwd();
        const deletePath = path.join(curr2, delPath);
        await fs.promises.rmdir(deletePath, { recursive: true });


        return { manifestUrl, uploadedFile };
    }


    // async convertToDashAndSaveToPublic(uploadedFile: { fileName: string; }) {
    //     const basePath = 'public/videos/raw';
    //     const ffmpegBasePath = `public/videos/ffmpeg/${uploadedFile.fileName}`;
    //     const subPath = `${basePath}/${uploadedFile.fileName}`;
    //     // const subPath = `${basePath}`;
    //     const curr = process.cwd();
    //     const rawFilePath = path.join(curr, subPath);

    //     const ffmpegFilesPath = path.join(process.cwd(), ffmpegBasePath);
    //     await fs.promises.mkdir(ffmpegFilesPath, { recursive: true });
    //     await this.videoProcessingService.convertToDASH(rawFilePath, ffmpegFilesPath);
    //     return ffmpegFilesPath;
    // }
    async convertToDashAndSaveToPublic(uploadedFile: { fileName: string; }) {

        const curr = process.cwd();

        const rawFilePath = path.join(curr, `public/videos/raw/${uploadedFile.fileName}`);
        const ffmpegFilesPath = path.join(curr, `public/videos/ffmpeg/${uploadedFile.fileName}`);

        await fs.promises.mkdir(ffmpegFilesPath, { recursive: true });
        console.log({ rawFilePath, ffmpegFilesPath })
        await this.videoProcessingService.convertToDASH(rawFilePath, ffmpegFilesPath);
        return ffmpegFilesPath;
    }
}
