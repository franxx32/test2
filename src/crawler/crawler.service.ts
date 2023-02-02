import { Injectable } from '@nestjs/common';
import { readdirSync } from 'fs';
import { Worker } from 'worker_threads';
import { PassThrough } from 'stream';

@Injectable()
export class CrawlerService {
  private crawlers: string[];
  private parsersPath = __dirname + '/parsers';

  async init() {
    const parsers = readdirSync(this.parsersPath).map(
      parser => parser.split('.')[0],
    );
    this.crawlers = [...new Set(parsers)];

    console.log(this.crawlers);
  }

  parseData() {
    const tunnel = new PassThrough();
    const promises = this.crawlers.map(crawler =>
      this.createWorker(crawler, tunnel),
    );
    Promise.all(promises).then(() => {
      tunnel.end();
    });

    return tunnel;
  }

  private createWorker(name: string, tunnel: PassThrough) {
    return new Promise(resolve => {
      const worker = new Worker(`${this.parsersPath}/${name}.parser.js`);
      worker.on('message', message => {
        console.log(message);
        tunnel.write(`${JSON.stringify(message)}`);
      });
      worker.on('error', err => {
        // tslint:disable-next-line:no-console
        console.log(err); // TODO: Update to logger
      });
      worker.on('exit', resolve);
    });
  }
}
