import { Request, Response } from 'express';
import { db } from '../database/database';
import { Heartbeat } from '../interfaces/Heartbeat';

export class RunningSinceController {
    public static handleRunningSince(req: Request, res: Response): void {
        console.log('GET /runningsince');
        // just get the first entry in the heartbeat table
        db.get<Heartbeat>('SELECT last_heartbeat FROM heartbeat ORDER BY id ASC LIMIT 1', (err, row) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error while querying runningsince');
                return;
            }
            if (row) {
                const firstHeartbeat = new Date(row.last_heartbeat).toLocaleString();
                return res.json({ runningSince: firstHeartbeat });
            }

            res.json({ status: 'No Data in heartbeat table' });
        });
    }
}
