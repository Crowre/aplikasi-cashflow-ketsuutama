import {
    findAllPemasukan,
    findPemasukanById,
    insertPemasukan,
    editPemasukanById,
    removePemasukanById,
} from "../service/incomeService.js";
import { successResponse } from "../utils/responseHelper.js";
import { catchAsync } from "../utils/catchAsync.js";

export const indexPemasukan = catchAsync(async (req, res) => {
    const data = await findAllPemasukan(req.query);
    return successResponse(res, data, "Data pemasukan berhasil diambil");
});

export const showPemasukan = catchAsync(async (req, res) => {
    const data = await findPemasukanById(req.params.id);
    return successResponse(res, data, "Detail pemasukan berhasil diambil");
});

export const storePemasukan = catchAsync(async (req, res) => {
    const data = await insertPemasukan(req.body);
    return successResponse(res, data, "Pemasukan berhasil ditambahkan", 201);
});

export const editPemasukan = catchAsync(async (req, res) => {
    const data = await editPemasukanById(req.params.id, req.body);
    return successResponse(res, data, "Pemasukan berhasil diubah");
});

export const destroyPemasukan = catchAsync(async (req, res) => {
    const data = await removePemasukanById(req.params.id);
    return successResponse(res, data, "Pemasukan berhasil dihapus");
});