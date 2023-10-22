import { Router } from 'express';
import { CheckServersController } from '../controllers/CheckServerController';

const checkServersRouter = Router();

checkServersRouter.post('/checkservers', CheckServersController.checkServers);

export default checkServersRouter;