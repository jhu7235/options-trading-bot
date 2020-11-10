import express from 'express';
import { openOptions } from '../triggers/triggers';
import { otbMorgan } from './logger';
import cors from 'cors';

const router = express.Router();

if(process.env.NODE_ENV !== 'production') {
   router.get(
     '/open-options',
     openOptions,
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

export { createServer } ;
 