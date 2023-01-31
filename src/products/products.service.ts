import { Injectable } from '@nestjs/common';
import { CrawlerService } from '../crawler/crawler.service';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class ProductsService {
  constructor(
    private crawlerService: CrawlerService,
    private jobsService: JobsService,
  ) {}

  async getProducts() {
    const trackId = 'randomUUID';
    const dataStream = this.crawlerService.parseData();
    this.jobsService.createNewJob(trackId, dataStream);

    return { trackId: trackId };
  }
}
