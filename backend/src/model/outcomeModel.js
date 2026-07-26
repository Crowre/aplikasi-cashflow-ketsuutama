import db from "../config/database.js";

export const getAllPengeluaran = async ({
    search = "",
    year = null,
    klasifikasi = "",
    lokasi_id = null,
} = {}) => {
    let query = `
    SELECT
      p.id,
      p.tanggal_perjalanan,
      p.klasifikasi_kode,
      p.deskripsi,
      p.biaya_pengeluaran,
      p.lokasi_id,
      l.nama_daerah AS lokasi,
      l.tipe_daerah,
      p.created_at,
      p.updated_at
    FROM pengeluaran p
    LEFT JOIN kabupaten_kota_sumbar l ON p.lokasi_id = l.id
    WHERE 1=1
  `;

    const values = [];
    let paramIndex = 1;

    if (search) {
        query += `
      AND (
        LOWER(p.klasifikasi_kode) LIKE LOWER($${paramIndex})
        OR LOWER(p.deskripsi) LIKE LOWER($${paramIndex})
        OR LOWER(l.nama_daerah) LIKE LOWER($${paramIndex})
        OR CAST(p.biaya_pengeluaran AS TEXT) LIKE $${paramIndex}
      )
    `;
        values.push(`%${search}%`);
        paramIndex++;
    }

    if (year) {
        query += ` AND EXTRACT(YEAR FROM p.tanggal_perjalanan) = $${paramIndex}`;
        values.push(year);
        paramIndex++;
    }

    if (klasifikasi) {
        query += ` AND UPPER(p.klasifikasi_kode) = UPPER($${paramIndex})`;
        values.push(klasifikasi);
        paramIndex++;
    }

    if (lokasi_id) {
        query += ` AND p.lokasi_id = $${paramIndex}`;
        values.push(lokasi_id);
        paramIndex++;
    }

    query += ` ORDER BY p.id ASC`;

    const result = await db.query(query, values);
    return result.rows;
};

export const getPengeluaranById = async (id) => {
    const result = await db.query(
        `
      SELECT
        p.id,
        p.tanggal_perjalanan,
        p.klasifikasi_kode,
        p.deskripsi,
        p.biaya_pengeluaran,
        p.lokasi_id,
        l.nama_daerah AS lokasi,
        l.tipe_daerah,
        p.created_at,
        p.updated_at
      FROM pengeluaran p
      LEFT JOIN kabupaten_kota_sumbar l ON p.lokasi_id = l.id
      WHERE p.id = $1
    `,
        [id]
    );

    return result.rows[0] || null;
};

export const createPengeluaran = async ({
    tanggal_perjalanan,
    klasifikasi_kode,
    deskripsi,
    biaya_pengeluaran,
    lokasi_id,
}) => {
    const result = await db.query(
        `
      INSERT INTO pengeluaran (tanggal_perjalanan, klasifikasi_kode, deskripsi, biaya_pengeluaran, lokasi_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, tanggal_perjalanan, klasifikasi_kode, deskripsi, biaya_pengeluaran, lokasi_id, created_at, updated_at
    `,
        [tanggal_perjalanan, klasifikasi_kode, deskripsi, biaya_pengeluaran, lokasi_id]
    );

    return result.rows[0];
};

export const updatePengeluaran = async (
    id,
    { tanggal_perjalanan, klasifikasi_kode, deskripsi, biaya_pengeluaran, lokasi_id }
) => {
    const result = await db.query(
        `
      UPDATE pengeluaran
      SET tanggal_perjalanan = $1,
          klasifikasi_kode = $2,
          deskripsi = $3,
          biaya_pengeluaran = $4,
          lokasi_id = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, tanggal_perjalanan, klasifikasi_kode, deskripsi, biaya_pengeluaran, lokasi_id, created_at, updated_at
    `,
        [tanggal_perjalanan, klasifikasi_kode, deskripsi, biaya_pengeluaran, lokasi_id, id]
    );

    return result.rows[0] || null;
};

export const deletePengeluaran = async (id) => {
    const result = await db.query(
        `
      DELETE FROM pengeluaran
      WHERE id = $1
      RETURNING id
    `,
        [id]
    );

    return result.rows[0] || null;
};

export const getAllLokasiSumbar = async () => {
    const result = await db.query(`
    SELECT id, nama_daerah, tipe_daerah
    FROM kabupaten_kota_sumbar
    ORDER BY
      CASE
        WHEN tipe_daerah = 'Kabupaten' THEN 1
        WHEN tipe_daerah = 'Kota' THEN 2
        ELSE 3
      END,
      nama_daerah ASC
  `);

    return result.rows;
};

export const getLokasiSumbarById = async (id) => {
    const result = await db.query(
        `SELECT id, nama_daerah, tipe_daerah FROM kabupaten_kota_sumbar WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
};