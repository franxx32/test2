import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from '../cache/cache.service';
import { CrawlerService } from '../crawler/crawler.service';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class ProductsService {
  constructor(
    private crawlerService: CrawlerService,
    private jobsService: JobsService,
    private cacheService: CacheService,
  ) {}

  async getProducts() {
    const trackId = uuidv4();
    const dataStream = this.crawlerService.parseData();
    this.jobsService.createNewJob(trackId, dataStream);
    this.cacheService.cacheByTrackId(trackId, dataStream);

    return { trackId };
  }
}
