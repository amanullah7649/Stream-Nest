import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileStreamingService } from './file-streaming.service';

@Controller('file-streaming')
export class FileStreamingController {
    constructor(private readonly streamService: FileStreamingService) { }

    @Get('list')
    async fileList(
        @Res() res: Response
    ) {
        return this.streamService.fileList(res)
    }

    @Get('folders')
    async readFolders(
    ): Promise<{ folders: string[]; }> {
        return await this.streamService.readFolders()
    }
    @Get('view')
    async readFile(
        @Req() req: Request,
        @Res() res: Response,
        @Query('fileName') fileName: string
    ): Promise<Response<any, Record<string, any>>> {
        return this.streamService.readFile(fileName, req, res)
    }

    @Get('view.mpd')
    async readMpdChunk(
        @Req() req: Request,
        @Res() res: Response,
        @Query('fileName') fileName: string,
        @Query('isLocal') isLocal: string,
    ) {
        return this.streamService.readMpdChunk(fileName, isLocal, req, res)
    }
    @Get(':stream')
    async readMpdFile(
        @Req() req: Request,
        @Res() res: Response,
        @Param('stream') stream: string,
        @Query('fileName') fileName: string,
        @Query('isLocal') isLocal: string,


    ) {
        return this.streamService.readMpdFile(stream, fileName, isLocal, req, res)
    }
}
