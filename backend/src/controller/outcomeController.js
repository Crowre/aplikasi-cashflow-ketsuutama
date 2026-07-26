import {
    findAllPengeluaran,
    findPengeluaranById,
    insertPengeluaran,
    editPengeluaranById,
    removePengeluaranById,
    findAllLokasiSumbar,
    findLokasiSumbarById,
} from "../service/outcomeService.js";
import { successResponse } from "../utils/responseHelper.js";
import { catchAsync } from "../utils/catchAsync.js";

export const indexPengeluaran = catchAsync(async (req, res) => {
    const data = await findAllPengeluaran(req.query);
    return successResponse(res, data, "Data pengeluaran berhasil diambil");
});

export const showPengeluaran = catchAsync(async (req, res) => {
    const data = await findPengeluaranById(req.params.id);
    return successResponse(res, data, "Detail pengeluaran berhasil diambil");
});

export const storePengeluaran = catchAsync(async (req, res) => {
    const data = await insertPengeluaran(req.body);
    return successResponse(res, data, "Data pengeluaran berhasil ditambahkan", 201);
});

export const updateDataPengeluaran = catchAsync(async (req, res) => {
    const data = await editPengeluaranById(req.params.id, req.body);
    return successResponse(res, data, "Data pengeluaran berhasil diperbarui");
});

export const destroyPengeluaran = catchAsync(async (req, res) => {
    const data = await removePengeluaranById(req.params.id);
    return successResponse(res, data, "Data pengeluaran berhasil dihapus");
});

export const indexLokasiSumbar = catchAsync(async (req, res) => {
    const data = await findAllLokasiSumbar();
    return successResponse(
        res,
        data,
        "Data kabupaten/kota Sumatera Barat berhasil diambil"
    );
});

export const showLokasiSumbar = catchAsync(async (req, res) => {
    const data = await findLokasiSumbarById(req.params.id);
    return successResponse(res, data, "Detail lokasi kabupaten/kota berhasil diambil");
});