import { Router } from 'express';
import { DownTimesController } from '../controllers/DownTimesController';

const downtimesRouter = Router();

downtimesRouter.get('/downtimes', DownTimesController.handleDowntimes);

export default downtimesRouter;
