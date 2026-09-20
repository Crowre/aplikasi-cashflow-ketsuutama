export const successResponse = (
    res,
    data,
    message = "Sukses",
    statusCode = 200
) => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        data,
    });
};

export const errorResponse = (
    res,
    message = "Terjadi kesalahan",
    statusCode = 400,
    errorCode = null
) => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        errorCode,
        data: null,
    });
};