import { Injectable, NotFoundException } from '@nestjs/common';
import { PassThrough } from 'stream';

@Injectable()
export class JobsService {
  private jobs: { [key in string]: PassThrough } = {};

  createNewJob(trackId: string, stream: PassThrough) {
    this.jobs[trackId] = stream;
  }

  getStream(trackId: string): PassThrough {
    const stream = this.jobs[trackId];
    if (!stream) {
      throw new NotFoundException();
    }

    stream.once('end', () => {
      delete this.jobs[trackId];
    });

    return stream;
  }
}
