import express from 'express';
import cors from 'cors';
import heartbeatRouter from './routes/heartbeat'; 
import runningSinceRouter from './routes/runningSince';
import usersRouter from './routes/users';

const app = express();

app.use(cors());

app.use('/api', heartbeatRouter)
app.use('/api', runningSinceRouter)
app.use('/api', usersRouter)

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
