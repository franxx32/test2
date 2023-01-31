import { parentPort } from 'worker_threads';

export function parseFunc() {
  let i = 0;
  const s = setInterval(() => {
    if (i === 10) {
      clearInterval(s);
    }
    parentPort.postMessage(`hi LG ${i++}`);
  }, 5000);
}

parseFunc();
