import { errorResponse } from "../utils/responseHelper.js";

export const errorHandler = (err, req, res, next) => {
    console.error(err);

    return errorResponse(
        res,
        err.message || "Terjadi kesalahan pada server",
        err.statusCode || 500,
        err.errorCode || null
    );
};