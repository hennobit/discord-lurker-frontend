import { Request, Response } from 'express';
import { db } from '../database/database';

export class CheckServersController {
    public static checkServers(req: Request, res: Response): void {
        const serverIds: string[] = req.body.serverIds;
        db.all('SELECT DISTINCT CAST(server_id AS TEXT) as server_id FROM user_info', (err, rows) => {
            if (err) {
                res.status(500).json({ error: 'Datenbankfehler' });
                return;
            }
            const dbServerIds = rows.map((row: any) => row.server_id);
            const matchingServerIds = serverIds.filter(id => dbServerIds.includes(id));

            res.json({ serverIds: matchingServerIds });
        });
    }
}
