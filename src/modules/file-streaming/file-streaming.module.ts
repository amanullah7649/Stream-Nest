import { Module } from '@nestjs/common';
import { FileStorageService } from '../file-storage/file-storage.service';
import { FileStreamingController } from './file-streaming.controller';
import { FileStreamingService } from './file-streaming.service';

@Module({
  providers: [FileStreamingService, FileStorageService],
  controllers: [FileStreamingController]
})
export class FileStreamingModule { }
