import express, { Request, Response } from 'express';
import { openOptions } from '../triggers/triggers';
import { otbMorgan } from './logger';
import cors from 'cors';

const router = express.Router();


// DEV: to manually trigger locally
if (process.env.NODE_ENV !== 'production') {
  router.get(
    '/open-options',
    async (req: Request, res: Response) => {
      try {
        await openOptions()
        res.status(200).send('done')
      } catch (e) {
        res.status(500).send('server error')
      }
      return;
    },
  );
}

const createServer = () => {
  const app = express();
  // Automatically allow cross-origin requests
  app.use(cors({ origin: true }));
  app.use(otbMorgan('common'));
  app.use((res, req, next) => { next(); });
  app.use('/', router);
  return app;
}

export { createServer };
