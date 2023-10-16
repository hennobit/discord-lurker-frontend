import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';

const usersRouter = Router();

usersRouter.get('/users', UsersController.handleUsers);

export default usersRouter;