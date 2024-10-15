import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';


@Controller()
export class AppController {
  constructor() { }

  @Get()
  async getHTML(
    @Res() res: Response
  ) {
    const curr = process.cwd();
    const rawFilePath = path.join(curr, 'public/index.html');

    const html = fs.readFileSync(rawFilePath, 'utf-8')
    res.send(html);
  }

  @Get('local')
  async getLocalHTML(
    @Res() res: Response
  ) {
    const curr = process.cwd();
    const rawFilePath = path.join(curr, 'public/local/index.html');

    const html = fs.readFileSync(rawFilePath, 'utf-8')
    res.send(html);
  }
  @Get('health')
  getHello(): string {
    return `Running streaming app`
  }
}
