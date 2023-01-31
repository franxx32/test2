import { Controller, Get, Param, Res } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get('subscribe/:trackId')
  subscribe(@Param('trackId') trackId: string, @Res() response) {
    const stream = this.jobsService.getStream(trackId);
    stream.uncork();
    stream.pipe(response);
  }
}
