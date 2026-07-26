import {
    getAllPengeluaran,
    getPengeluaranById,
    createPengeluaran,
    updatePengeluaran,
    deletePengeluaran,
    getAllLokasiSumbar,
    getLokasiSumbarById,
} from "../model/outcomeModel.js";
import { AppError } from "../utils/appError.js";

const normalizeString = (value) => {
    if (value === undefined || value === null) return "";
    return String(value).trim();
};

const validatePengeluaranPayload = async ({
    tanggal_perjalanan,
    klasifikasi_kode,
    deskripsi,
    biaya_pengeluaran,
    lokasi_id,
}) => {
    const cleanTanggal = normalizeString(tanggal_perjalanan);
    const cleanKlasifikasi = normalizeString(klasifikasi_kode).toUpperCase();
    const cleanDeskripsi = normalizeString(deskripsi);

    if (!cleanTanggal) throw new AppError("Tanggal perjalanan wajib diisi", 400, 102);
    if (!cleanKlasifikasi) throw new AppError("Klasifikasi kode wajib diisi", 400, 102);
    if (!cleanDeskripsi) throw new AppError("Deskripsi wajib diisi", 400, 102);

    if (
        biaya_pengeluaran === undefined ||
        biaya_pengeluaran === null ||
        String(biaya_pengeluaran).trim() === ""
    ) {
        throw new AppError("Biaya pengeluaran wajib diisi", 400, 102);
    }

    const nominal = Number(biaya_pengeluaran);
    if (Number.isNaN(nominal)) {
        throw new AppError("Biaya pengeluaran harus berupa angka", 400, 102);
    }

    if (nominal <= 0) {
        throw new AppError("Biaya pengeluaran harus lebih besar dari 0", 400, 102);
    }

    if (lokasi_id === undefined || lokasi_id === null || String(lokasi_id).trim() === "") {
        throw new AppError("Lokasi wajib dipilih", 400, 102);
    }

    const lokasi = await getLokasiSumbarById(Number(lokasi_id));
    if (!lokasi) {
        throw new AppError("Lokasi yang dipilih tidak ditemukan", 404, 104);
    }

    return {
        tanggal_perjalanan: cleanTanggal,
        klasifikasi_kode: cleanKlasifikasi,
        deskripsi: cleanDeskripsi,
        biaya_pengeluaran: nominal,
        lokasi_id: Number(lokasi_id),
    };
};

const validateOutcomeQuery = ({ search, year, klasifikasi, lokasi_id }) => {
    const cleanSearch = normalizeString(search);
    const cleanYear = normalizeString(year);
    const cleanKlasifikasi = normalizeString(klasifikasi).toUpperCase();
    const cleanLokasi_Id = normalizeString(lokasi_id);

    let yearNumber = null;
    let lokasiNumber = null;

    if (cleanYear) {
        yearNumber = Number(cleanYear);
        if (Number.isNaN(yearNumber) || cleanYear.length !== 4) {
            throw new AppError("Parameter year harus berupa tahun yang valid", 400, 102);
        }
    }

    if (cleanLokasi_Id) {
        lokasiNumber = Number(cleanLokasi_Id);
        if (Number.isNaN(lokasiNumber)) {
            throw new AppError("Parameter lokasi_id harus berupa angka", 400, 102);
        }
    }

    return {
        search: cleanSearch,
        year: yearNumber,
        klasifikasi: cleanKlasifikasi,
        lokasi_id: lokasiNumber,
    };
};

export const findAllPengeluaran = async (query = {}) => {
    const validatedQuery = validateOutcomeQuery(query);
    return await getAllPengeluaran(validatedQuery);
};

export const findPengeluaranById = async (id) => {
    const data = await getPengeluaranById(id);
    if (!data) throw new AppError("Pengeluaran tidak ditemukan", 404, 104);
    return data;
};

export const insertPengeluaran = async (payload) => {
    if (Array.isArray(payload)) {
        if (payload.length === 0) {
            throw new AppError("Data pengeluaran tidak boleh kosong", 400, 102);
        }

        const results = [];
        for (let i = 0; i < payload.length; i++) {
            const item = payload[i];
            if (!item || typeof item !== "object" || Array.isArray(item)) {
                throw new AppError(`Data pengeluaran pada index ${i} tidak valid`, 400, 102);
            }
            const validatedPayload = await validatePengeluaranPayload(item);
            const created = await createPengeluaran(validatedPayload);
            results.push(created);
        }
        return results;
    }

    if (!payload || typeof payload !== "object") {
        throw new AppError("Payload pengeluaran tidak valid", 400, 102);
    }

    const validatedPayload = await validatePengeluaranPayload(payload);
    return await createPengeluaran(validatedPayload);
};

export const editPengeluaranById = async (id, payload) => {
    await findPengeluaranById(id);
    const validatedPayload = await validatePengeluaranPayload(payload);
    return await updatePengeluaran(id, validatedPayload);
};

export const removePengeluaranById = async (id) => {
    const deleted = await deletePengeluaran(id);
    if (!deleted) throw new AppError("Pengeluaran tidak ditemukan", 404, 104);
    return deleted;
};

export const findAllLokasiSumbar = async () => {
    return await getAllLokasiSumbar();
};

export const findLokasiSumbarById = async (id) => {
    const lokasi = await getLokasiSumbarById(id);
    if (!lokasi) throw new AppError("Lokasi tidak ditemukan", 404, 104);
    return lokasi;
};