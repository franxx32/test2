import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { JobsModule } from '../jobs/jobs.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [CrawlerModule, JobsModule, CacheModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
