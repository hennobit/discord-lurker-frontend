import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { User } from './interfaces/User';
import { Heartbeat } from './interfaces/Heartbeat';

const app = express();
const db = new sqlite3.Database('../database/user_info.db');

app.use(cors());

app.get('/users', (req: Request, res: Response<User[]>) => {
    db.all<User>(
        `SELECT ui.user_id, ui.server_id, ui.username, ui.status, ui.unmuted_time, ui.total_time_muted, ui.total_time_sound_muted,
                vci.voice_channel, vci.total_time, ost.online_total, ost.offline_total, ost.idle_total, ost.dnd_total
         FROM user_info ui
         LEFT JOIN voice_channel_info vci ON ui.user_id = vci.user_id AND ui.server_id = vci.server_id
         LEFT JOIN online_status_time ost ON ui.user_id = ost.user_id AND ui.server_id = ost.server_id
         WHERE ui.server_id = 453616970940809248 
         ORDER BY vci.total_time DESC`,
        // erstmal nur für den "FLYV"-Server
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send([]);
            } else {
                res.json(rows);
            }
        }
    );
});

app.get('/heartbeat', (req: Request, res: Response) => {
    console.log('GET /heartbeat');
    db.get<Heartbeat>('SELECT last_heartbeat FROM heartbeat ORDER BY id DESC LIMIT 1', (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send('Fehler beim Abfragen des heartbeats');
            return;
        }
        if (row) {
            const lastHeartbeat = new Date(row.last_heartbeat);
            const now = new Date();
            const difference = Math.abs(now.getTime() - lastHeartbeat.getTime()) / 1000;

            if (difference <= 7205) {
                res.json({ status: 'online' });
                return;
            }

            res.json({ status: 'offline' });
            return;
        }

        res.json({ status: 'Keine Daten in der heartbeat-Tabelle' });
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
