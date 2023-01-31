import { Controller, Get, Param, Response } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get('subscribe/:trackId')
  async subscribe(@Param('trackId') trackId: string, @Response() response) {
    const stream = this.jobsService.getStream(trackId);

    response.set({
      'Content-Type': 'text/event-stream',
      ['Connection']: 'keep-alive',
      'Cache-Control': 'no-cache',
    });
    response.flushHeaders();
    stream.uncork();

    stream.pipe(response);
  }
}
