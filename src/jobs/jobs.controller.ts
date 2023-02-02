import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Transform } from 'stream';
import { CacheService } from '../cache/cache.service';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private jobsService: JobsService,
    private cacheService: CacheService,
  ) {}

  @Get('subscribe/:trackId')
  async subscribe(
    @Param('trackId') trackId: string,
    @Res() response: Response,
  ) {
    const { stream, isDone } = this.jobsService.getStream(trackId);

    if (isDone) {
      throw new BadRequestException('Cache generated');
    }

    response.set({
      'Content-Type': 'text/event-stream',
      ['Connection']: 'keep-alive',
      'Cache-Control': 'no-cache',
    });
    response.flushHeaders();

    this.cacheService.getByTrackId(trackId).forEach(item => {
      response.write(`data: ${item}\n\n`);
    });

    stream.pipe(this.sseTransformStream).pipe(response);

    response.on('close', () => {
      stream.unpipe(this.sseTransformStream).unpipe(response);
    });
  }

  @Get('cache/:trackId')
  async getCache(@Param('trackId') trackId: string, @Res() response: Response) {
    const isReady = this.cacheService.isReady(trackId);
    if (isReady === undefined) {
      throw new NotFoundException();
    }
    if (isReady === false) {
      throw new BadRequestException('Not ready yet');
    }
    const items = this.cacheService.getByTrackId(trackId);
    response.json(items);
  }

  private sseTransformStream = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, `data: ${String(chunk)}\n\n`);
    },
  });
}
