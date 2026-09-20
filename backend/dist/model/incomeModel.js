import db from "../config/database.js";

export const getAllPemasukan = async ({ search = "", year = null } = {}) => {
    let query = `
    SELECT
      id,
      tanggal_proyek,
      nama_proyek,
      jumlah_pemasukan,
      created_at,
      updated_at
    FROM pemasukan
    WHERE 1=1
  `;

    const values = [];
    let paramIndex = 1;

    if (search) {
        query += `
      AND (
        LOWER(nama_proyek) LIKE LOWER($${paramIndex})
        OR CAST(jumlah_pemasukan AS TEXT) LIKE $${paramIndex}
      )
    `;
        values.push(`%${search}%`);
        paramIndex++;
    }

    if (year) {
        query += ` AND EXTRACT(YEAR FROM tanggal_proyek) = $${paramIndex}`;
        values.push(year);
        paramIndex++;
    }

    query += ` ORDER BY id ASC`;

    const result = await db.query(query, values);
    return result.rows;
};

export const getPemasukanById = async (id) => {
    const result = await db.query(
        `
      SELECT
        id,
        tanggal_proyek,
        nama_proyek,
        jumlah_pemasukan,
        created_at,
        updated_at
      FROM pemasukan
      WHERE id = $1
    `,
        [id]
    );

    return result.rows[0] || null;
};

export const createPemasukan = async ({ tanggal_proyek, nama_proyek, jumlah_pemasukan }) => {
    const result = await db.query(
        `
      INSERT INTO pemasukan (tanggal_proyek, nama_proyek, jumlah_pemasukan)
      VALUES ($1, $2, $3)
      RETURNING id, tanggal_proyek, nama_proyek, jumlah_pemasukan, created_at, updated_at
    `,
        [tanggal_proyek, nama_proyek, jumlah_pemasukan]
    );

    return result.rows[0];
};

export const updatePemasukan = async (id, { tanggal_proyek, nama_proyek, jumlah_pemasukan }) => {
    const result = await db.query(
        `
      UPDATE pemasukan
      SET tanggal_proyek = $1,
          nama_proyek = $2,
          jumlah_pemasukan = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, tanggal_proyek, nama_proyek, jumlah_pemasukan, created_at, updated_at
    `,
        [tanggal_proyek, nama_proyek, jumlah_pemasukan, id]
    );

    return result.rows[0] || null;
};

export const deletePemasukan = async (id) => {
    const result = await db.query(
        `DELETE FROM pemasukan WHERE id = $1 RETURNING id`,
        [id]
    );

    return result.rows[0] || null;
};