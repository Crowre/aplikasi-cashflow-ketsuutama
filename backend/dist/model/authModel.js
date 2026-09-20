import db from '../config/database.js';

export const findUserByUsername = async (username) => {
    const result = await db.query(
        'SELECT id, username, password, first_name, last_name FROM users WHERE username = $1',
        [username]
    );
    return result.rows[0] || null;
};

export const createUser = async ({ username, password, first_name, last_name }) => {
    const result = await db.query(
        `INSERT INTO users (username, password, first_name, last_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, first_name, last_name`,
        [username, password, first_name, last_name]
    );
    return result.rows[0];
};