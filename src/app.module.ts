import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CacheModule } from './cache/cache.module';
import { CrawlerModule } from './crawler/crawler.module';
import { JobsModule } from './jobs/jobs.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [CrawlerModule, ProductsModule, JobsModule, CacheModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
