import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('../database/user_info.db');

export { db };
