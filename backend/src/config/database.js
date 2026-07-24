import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    max: 20
}

const pool = new Pool(dbConfig);

pool.connect()
    .then(client => {
        console.log('Database connected successfully');
        console.log('DB Config:', dbConfig);
        client.release();
    })
    .catch(err => {
        console.log('Database connection failed:', err)
    });

export default pool;