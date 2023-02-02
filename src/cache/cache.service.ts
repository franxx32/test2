import { Injectable, NotFoundException } from '@nestjs/common';
import { PassThrough } from 'stream';

@Injectable()
export class CacheService {
  private caches = {};

  async cacheByTrackId(trackId: string, steam: PassThrough): Promise<void> {
    this.caches[trackId] = {
      isReady: false,
      items: [],
    };

    for await (const item of steam) {
      this.caches[trackId].items.push(item.toString());
    }
    this.caches[trackId].isReady = true;
  }

  isReady(trackId: string) {
    return this.caches[trackId]?.isReady;
  }

  getByTrackId(trackId: string) {
    return this.caches[trackId]?.items;
  }
}
