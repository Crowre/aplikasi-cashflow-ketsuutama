import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    }),
    max: 20,
    connectionTimeoutMillis: 10000
}

const pool = new Pool(dbConfig);

pool.connect()
    .then(client => {
        console.log('Database connected successfully');
        client.release();
    })
    .catch(err => {
        console.log('Database connection failed:', err)
    });

export default pool;
