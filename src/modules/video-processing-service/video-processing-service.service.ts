import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

@Injectable()
export class VideoProcessingService {
    async convertToDASH(inputPath: string, outputDir: string): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .outputOptions('-profile:v main')
                    .outputOptions('-vf scale=-2:720') // Convert to 720p resolution
                    .outputOptions('-keyint_min 60')
                    .outputOptions('-g 60')
                    .outputOptions('-sc_threshold 0')
                    .outputOptions('-b:v 2500k')
                    .outputOptions('-maxrate 2675k')
                    .outputOptions('-bufsize 3750k')
                    .outputOptions('-b:a 128k')
                    .output(path.join(outputDir, 'output.mpd')) // DASH manifest file
                    .format('dash') // DASH format
                    .on('end', () => resolve())
                    .on('error', (err) => reject(err))
                    .run();
            });
        } catch (error) {
            console.log(`Error on convert to DASH : ${error?.message}`);

        }
    }
}
