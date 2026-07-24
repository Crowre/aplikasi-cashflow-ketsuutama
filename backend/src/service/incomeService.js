import {
    getAllPemasukan,
    getPemasukanById,
    createPemasukan,
    updatePemasukan,
    deletePemasukan,
} from "../model/incomeModel.js";
import { AppError } from "../utils/appError.js";

const normalizeString = (value) => {
    if (value === undefined || value === null) return "";
    return String(value).trim();
};

const validateIncomePayload = ({ tanggal_proyek, nama_proyek, jumlah_pemasukan }) => {
    const cleanTanggal = normalizeString(tanggal_proyek);
    const cleanNama = normalizeString(nama_proyek);

    if (!cleanTanggal) {
        throw new AppError("Tanggal proyek wajib diisi", 400, 102);
    }

    if (!cleanNama) {
        throw new AppError("Nama proyek wajib diisi", 400, 102);
    }

    if (
        jumlah_pemasukan === undefined ||
        jumlah_pemasukan === null ||
        String(jumlah_pemasukan).trim() === ""
    ) {
        throw new AppError("Jumlah pemasukan wajib diisi", 400, 102);
    }

    const nominal = Number(jumlah_pemasukan);

    if (Number.isNaN(nominal)) {
        throw new AppError("Jumlah pemasukan harus berupa angka", 400, 102);
    }

    if (nominal <= 0) {
        throw new AppError("Jumlah pemasukan harus lebih besar dari 0", 400, 102);
    }

    return {
        tanggal_proyek: cleanTanggal,
        nama_proyek: cleanNama,
        jumlah_pemasukan: nominal,
    };
};

export const findAllPemasukan = async () => {
    return await getAllPemasukan();
};

export const findPemasukanById = async (id) => {
    const data = await getPemasukanById(id);

    if (!data) {
        throw new AppError("Pemasukan tidak ditemukan", 404, 104);
    }

    return data;
};

export const insertPemasukan = async (payload) => {
    const validatedPayload = validateIncomePayload(payload);
    return await createPemasukan(validatedPayload);
};

export const editPemasukanById = async (id, payload) => {
    await findPemasukanById(id);

    const validatedPayload = validateIncomePayload(payload);
    return await updatePemasukan(id, validatedPayload);
};

export const removePemasukanById = async (id) => {
    const deleted = await deletePemasukan(id);

    if (!deleted) {
        throw new AppError("Pemasukan tidak ditemukan", 404, 104);
    }

    return deleted;
};