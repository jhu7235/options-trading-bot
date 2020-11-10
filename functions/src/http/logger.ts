/* eslint-disable import/no-mutable-exports */
import morgan from 'morgan';

let logger = console.log;
let otbMorgan: any = morgan;
if (process.env.NODE_ENV === 'silent') {
  // debug.enabled = false;
  logger = () => null;
  otbMorgan = () => (res: any, req: any, next: any) => { next(); };
}

export { otbMorgan, logger };
