import { Request, Response } from 'express';
import { db } from '../database/database';
import { Downtime } from '../interfaces/Downtime';

export class DownTimesController {
    public static handleDowntimes(req: Request, res: Response): void {
        console.log('GET /downtimes');
        db.all<Downtime>('SELECT "from", "to" FROM downtime', (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error while querying downtimes');
                return;
            }
            console.log('rows', rows);
            if (rows) {
                const downtimes = rows.map((row) => ({
                    from: new Date(row.from).toLocaleString(),
                    to: new Date(row.to).toLocaleString(),
                }));
                return res.json({ downtimes });
            }

            res.json({ status: 'No Data in downtime table' });
        });
    }
}
