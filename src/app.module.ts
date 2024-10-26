import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { databaseConfig } from './config/database.config';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { FileStreamingModule } from './modules/file-streaming/file-streaming.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { VideoProcessingServiceModule } from './modules/video-processing-service/video-processing-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    FileUploadModule,
    FileStreamingModule,
    FileStorageModule,
    VideoProcessingServiceModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
