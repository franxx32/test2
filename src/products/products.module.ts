import { Module } from '@nestjs/common';
import { CrawlerModule } from '../crawler/crawler.module';
import { JobsModule } from '../jobs/jobs.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [CrawlerModule, JobsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
