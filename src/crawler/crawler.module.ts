import { Module, OnModuleInit } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule implements OnModuleInit {
  constructor(private service: CrawlerService) {}

  async onModuleInit() {
    await this.service.init();
    // await this.service.parseData();
    console.log(`Initialization...`);
  }
}
