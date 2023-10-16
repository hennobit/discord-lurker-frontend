import { Request, Response } from 'express';
import { db } from '../database/database';
import { Heartbeat } from '../interfaces/Heartbeat';

export class HeartbeatController {
    public static handleHeartbeat(req: Request, res: Response): void {
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

                // this condition won't work anymore when daylight saving time ends. pls fix.
                if (difference <= 7205) {
                    res.json({ status: 'online' });
                    return;
                }

                res.json({ status: 'offline' });
                return;
            }

            res.json({ status: 'Keine Daten in der heartbeat-Tabelle' });
        });
    }
}
