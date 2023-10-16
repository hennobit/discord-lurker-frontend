import { Router } from 'express';
import { HeartbeatController } from '../controllers/HeartbeatController';

const heartbeatRouter = Router();

heartbeatRouter.get('/heartbeat', HeartbeatController.handleHeartbeat);

export default heartbeatRouter;
