import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('file-upload')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {

        if (!file) {
            throw new Error("file not found")
        }
        const startTime = performance.now();

        const response = await this.fileUploadService.upload(file)

        const endTime = performance.now();
        const duration = endTime - startTime;

        return {
            message: 'File uploaded successfully',
            file: file.originalname,
            fileId: response.fileName,
            duration: duration.toFixed(2) + ' ms',
        }
    }
    @Post('/by-stream')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFileByStream(@UploadedFile() file: Express.Multer.File) {

        if (!file) {
            throw new Error("file not found")
        }
        const startTime = performance.now();

        const response = await this.fileUploadService.uploadByStream(file)

        const endTime = performance.now();
        const duration = endTime - startTime;

        return {
            message: 'File uploaded successfully',
            file: file.originalname,
            fileId: response.fileName,
            duration: duration.toFixed(2) + ' ms',
        }
    }

    @Post('/by-ffmpeg')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFileByffmpeg(@UploadedFile() file: Express.Multer.File): Promise<{ message: string; file: string; fileId: string; manifestUrl: string; duration: string; }> {

        if (!file) {
            throw new Error("file not found")
        }
        const startTime = performance.now();

        const response = await this.fileUploadService.uploadFileByffmpeg(file)

        const endTime = performance.now();
        const duration = endTime - startTime;

        return {
            message: 'File uploaded successfully',
            file: file.originalname,
            fileId: response.uploadedFile.fileName,
            manifestUrl: response.manifestUrl,
            duration: duration.toFixed(2) + ' ms',
        }
    }









}
