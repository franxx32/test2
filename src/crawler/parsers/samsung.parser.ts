import { parentPort } from 'worker_threads';

export function parseFunc() {
  parentPort.postMessage('hi Samsung');
}

parseFunc();
