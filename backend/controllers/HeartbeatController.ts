import { Request, Response } from 'express';
import { db } from '../database/database';
import { Heartbeat } from '../interfaces/Heartbeat';
import { Downtime } from '../interfaces/Downtime';

let consecutiveHeartbeatFails = 0;

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
                    consecutiveHeartbeatFails = 0;
                    res.json({ status: 'online' });
                    HeartbeatController.handleHeartbeatStatusChange(false);
                    return;
                }
                consecutiveHeartbeatFails++;

                if (consecutiveHeartbeatFails >= 3) {
                    HeartbeatController.handleHeartbeatStatusChange(true);
                    res.json({ status: 'offline' });
                    return;
                }

                res.json({ status: 'offline' });
                return;
            }

            res.json({ status: 'Keine Daten in der heartbeat-Tabelle' });
        });
    }

    public static handleHeartbeatStatusChange(offline: boolean): void {
        if (offline) {
            // check if there is already a downtime in the database
            db.get('SELECT * FROM downtime WHERE "to" IS NULL', (err, existingDowntime: Downtime) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (!existingDowntime) {
                    // if no downtime is registered, create a new one
                    db.run('INSERT INTO downtime ("from", "to") VALUES (?, NULL)', [new Date().toISOString()], (insertErr) => {
                        if (insertErr) {
                            console.error(insertErr);
                            return;
                        }
                        console.log('New downtime registered');
                    });
                }
            });
        } else {
            // check if there is a downtime in the database with "to" = NULL
            db.get('SELECT * FROM downtime WHERE "to" IS NULL', (err, existingDowntime: Downtime) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (existingDowntime) {
                    // if a downtime is already registered, update it
                    db.run(
                        'UPDATE downtime SET "to" = ? WHERE id = ?',
                        [new Date().toISOString(), existingDowntime.id],
                        (updateErr) => {
                            if (updateErr) {
                                console.error(updateErr);
                                return;
                            }
                            console.log('Updated existing downtime');
                        }
                    );
                }
            });
        }
    }
}
