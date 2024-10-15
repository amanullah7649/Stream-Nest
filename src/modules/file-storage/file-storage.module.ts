import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';

@Module({
  providers: [FileStorageService],
  controllers: [FileStorageController]
})
export class FileStorageModule {}