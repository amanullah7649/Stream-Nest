import { Module } from '@nestjs/common';
import { FileStorageService } from '../file-storage/file-storage.service';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { VideoProcessingService } from '../video-processing-service/video-processing-service.service';

@Module({
  providers: [FileUploadService, FileStorageService, VideoProcessingService],
  controllers: [FileUploadController],
  imports: []
})
export class FileUploadModule { }
