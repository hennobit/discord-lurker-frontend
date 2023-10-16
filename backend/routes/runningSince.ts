import { Router } from 'express';
import { RunningSinceController } from '../controllers/RunningSinceController';

const runningSinceRouter = Router();

runningSinceRouter.get('/runningsince', RunningSinceController.handleRunningSince);

export default runningSinceRouter;
