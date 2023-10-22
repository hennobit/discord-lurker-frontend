import express from 'express';
import cors from 'cors';
import heartbeatRouter from './routes/heartbeat';
import runningSinceRouter from './routes/runningSince';
import usersRouter from './routes/users';
import downtimes from './routes/downtimes';
import bodyParser from 'body-parser';
import fs from 'fs';
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(heartbeatRouter);
app.use(runningSinceRouter);
app.use(usersRouter);
app.use(downtimes);

app.get('/secret', (req, res) => {
    fs.readFile('not_a_secret.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Fehler beim Lesen der Datei');
            return;
        }
        res.send(data);
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
