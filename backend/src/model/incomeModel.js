import db from '../config/database.js';

export const getAllPemasukan = async () => {
    const result = await db.query(
        "SELECT * FROM pemasukan ORDER BY tanggal_proyek ASC, id ASC"
    );
    return result.rows;
};

export const getPemasukanById = async (id) => {
    const result = await db.query(
        "SELECT * FROM pemasukan WHERE id = $1",
        [id]
    );
    return result.rows[0];
};

export const createPemasukan = async ({ tanggal_proyek, nama_proyek, jumlah_pemasukan }) => {
    const result = await db.query(
        `INSERT INTO pemasukan (tanggal_proyek, nama_proyek, jumlah_pemasukan)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [tanggal_proyek, nama_proyek, jumlah_pemasukan]
    );
    return result.rows[0];
};

export const updatePemasukan = async (id, { tanggal_proyek, nama_proyek, jumlah_pemasukan }) => {
    const result = await db.query(
        `UPDATE pemasukan
     SET tanggal_proyek = $1,
         nama_proyek = $2,
         jumlah_pemasukan = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
        [tanggal_proyek, nama_proyek, jumlah_pemasukan, id]
    );
    return result.rows[0];
};

export const deletePemasukan = async (id) => {
    const result = await db.query(
        "DELETE FROM pemasukan WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};