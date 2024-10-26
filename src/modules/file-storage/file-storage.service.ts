import { CreateBucketCommand, GetObjectCommand, GetObjectCommandOutput, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from 'src/config/app.config';
import { Readable } from 'stream';



@Injectable()
export class FileStorageService {
    private s3: S3Client;

    constructor() {
        this.s3 = new S3Client({
            endpoint: AppConfig.MINIO_ENDPOINT,
            region: 'us-east-1',
            credentials: {
                accessKeyId: AppConfig.MINIO_ACCESS_KEY,
                secretAccessKey: AppConfig.MINIO_SECRET_KEY,
            }
        })
    }

    async handleFile(file: Express.Multer.File, type: string, process: string): Promise<{ fileName: string; }> {

        if (type == "video" && process == 'stream') {
            // await this.saveS3(AppConfig.minio_bucket_name, file.originalname, file.buffer);
            return await this.saveToPublicByStream(file);
        }
        else if (type = "video") {
            await this.saveS3(AppConfig.MINIO_BUCKET_NAME, file.originalname, file.buffer);
            return await this.saveToPublic(file);

        }

    }
    createUniqueFileName(originalName: string): string {
        const fileTypeAr = originalName?.split('.');
        const fileType = fileTypeAr[fileTypeAr?.length - 1];

        // Remove punctuation and extra spaces, then split into words
        const sanitized = originalName
            .replace(/[^\w\s]|_/g, '') // Remove punctuation
            .replace(/\s+/g, ' ')      // Replace multiple spaces with a single space
            .trim();                   // Trim leading and trailing whitespace

        // Join the words with underscores
        const uniqueFileName = sanitized.split(' ').join('_');

        return `${uniqueFileName}.${fileType}`;
    }
    async saveToPublicByStream(file: Express.Multer.File): Promise<{ fileName: string; }> {

        try {
            const basePath = 'public/videos/raw'
            // const uploadDir = path.join(__dirname, '..', '..', 'public');
            const uploadDir = path.join(process.cwd(), basePath);
            const fileName = this.createUniqueFileName(file.originalname);
            const uploadPath = path.join(uploadDir, fileName);

            // Check if the directory exists, and create it if it doesn't
            await fs.promises.mkdir(uploadDir, { recursive: true });

            const writeStream = fs.createWriteStream(uploadPath);
            writeStream.write(file.buffer);
            writeStream.end();


            writeStream.on('finish', () => {
                console.log(`File saved to ${uploadPath}`);
            })
            writeStream.on("error", () => {
                console.log(`File saved to ${uploadPath}`);
            })

            return { fileName }

        } catch (error) {

            console.error('Error saving file:', error);
            throw error;
        }
    }
    async saveToPublic(file: Express.Multer.File): Promise<{ fileName: string; }> {

        try {
            const basePath = 'public/videos'
            // const uploadDir = path.join(__dirname, '..', '..', 'public');
            const uploadDir = path.join(process.cwd(), basePath);
            const fileName = this.createUniqueFileName(file.originalname);
            const uploadPath = path.join(uploadDir, fileName);

            // Check if the directory exists, and create it if it doesn't
            await fs.promises.mkdir(uploadDir, { recursive: true });

            await fs.promises.writeFile(uploadPath, file.buffer);

            console.log(`File saved to ${uploadPath}`);
            return { fileName }

        } catch (error) {

            console.error('Error saving file:', error);
            throw error;
        }
    }

    async allFilesFromPublic(res: Response) {
        try {
            const directoryPath = path.join(process.cwd(), 'public', 'videos/ffmpeg');

            // Read the contents of the directory
            const folders = await fs.promises.readdir(directoryPath);

            res.json({ folders: folders });
        } catch (error) {
            console.error('Error reading directory:', error?.message);
            res.status(500).json({ error: 'Failed to read directory' });
        }
    }
    checkHeader(req: Request, res: Response, videoPath: string) {
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (!range) {
            res.status(400).send("Requires Range header");
        }


        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        return { chunkSize, start, end, fileSize }

    }
    async viewFromPublic(fileName: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {

            const basePath = 'public/videos'
            const videoPath = path.join(process.cwd(), basePath, fileName);

            const { chunkSize, start, end, fileSize } = this.checkHeader(req, res, videoPath);
            console.log({ chunkSize, start, end, fileSize });


            if (!fs.existsSync(videoPath)) {
                return res.status(404).send('Video not found');
            }

            const fileStream = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `inline; filename="${fileName}"`,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
            };
            res.writeHead(206, head);

            fileStream.pipe(res);
        } catch (error) {
            console.error('Error viewing video:', error);
            throw error;
        }
    }
    async viewFromVideoChunk(fileName: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {

            const videoPath = path.join(process.cwd(), fileName);

            const { chunkSize, start, end, fileSize } = this.checkHeader(req, res, videoPath);
            console.log({ chunkSize, start, end, fileSize });


            if (!fs.existsSync(videoPath)) {
                return res.status(404).send('Video not found');
            }

            const fileStream = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `inline; filename="${fileName}"`,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
            };
            res.writeHead(206, head);

            fileStream.pipe(res);
        } catch (error) {
            console.error('Error viewing video:', error);
            throw error;
        }
    }
    async viewMpdFile(fileName: string, req: Request, res: Response) {
        try {

            const directoryPath = path.join(process.cwd(), 'public', 'videos/ffmpeg/Cutemp4.mp4/output.mpd');
            res.sendFile(directoryPath);

        } catch (error) {
            console.error('Error reading directory:', error);
            res.status(500).json({ error: 'Failed to read directory' });
        }
    }

    async saveS3(
        bucketName: string, key: string, body: Buffer | Readable
    ) {
        await this.createBucketIfNotExists(bucketName)
        const s3Command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: body,
            ContentType: 'application/octet-stream', // Specify content type if possible

        });
        return await this.s3.send(s3Command);
    }
    async getFolders(): Promise<string[]> {
        const command = new ListObjectsV2Command({
            Bucket: AppConfig.MINIO_BUCKET_NAME,
            Delimiter: '/', // This ensures we get "folders"
        });

        try {
            const result = await this.s3.send(command);
            const folderNames = result.CommonPrefixes?.map((prefix) => prefix.Prefix) || [];
            return folderNames;
        } catch (error) {
            console.error('Error fetching folders from S3:', error);
            throw error;
        }
    }
    async getFile(bucket: string, key: string): Promise<GetObjectCommandOutput> {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        try {
            const file = await this.s3.send(command);
            if (!file.Body) {
                throw new Error('File not found');
            }
            return file; // Body is the stream that can be piped
        } catch (error) {
            throw new Error(`Error retrieving file from S3: ${error.message}`);
        }
    }
    async createBucketIfNotExists(bucketName: string) {
        const { Buckets } = await this.s3.send(new ListBucketsCommand({}));
        const bucketExists = Buckets?.some(bucket => bucket.Name === bucketName);

        if (!bucketExists) {
            const res = await this.s3.send(new CreateBucketCommand({ Bucket: bucketName }));
            console.log(`Bucket "${bucketName}" created.`);
        }
    }

    async uploadFfmpegFolder(bucket: string, dirPath: string, s3KeyPrefix: string) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const fileStream = fs.createReadStream(filePath);

            const key = `${s3KeyPrefix}/${file}`;
            await this.saveS3(bucket, key, fileStream);
        }
    }
}
