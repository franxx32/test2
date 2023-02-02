import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassThrough } from 'stream';

@Injectable()
export class JobsService {
  private jobs: {
    [key in string]: { stream: PassThrough; isDone: boolean };
  } = {};

  createNewJob(trackId: string, stream: PassThrough) {
    this.jobs[trackId] = { stream, isDone: false };

    stream.once('end', () => {
      delete this.jobs[trackId].stream;
      this.jobs[trackId].isDone = true;
    });
  }

  getStream(trackId: string): { stream: PassThrough; isDone: boolean } {
    const job = this.jobs[trackId];
    if (!job) {
      throw new NotFoundException();
    }

    return job;
  }
}
