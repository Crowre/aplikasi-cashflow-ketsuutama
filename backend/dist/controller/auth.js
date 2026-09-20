import { registerUser, loginUser } from "../service/authService.js";
import { successResponse } from "../utils/responseHelper.js";
import { catchAsync } from "../utils/catchAsync.js";

export const register = catchAsync(async (req, res) => {
    const user = await registerUser(req.body);
    return successResponse(
        res,
        user,
        "Registrasi user berhasil, silakan login",
        201
    );
});

export const login = catchAsync(async (req, res) => {
    const result = await loginUser(req.body);
    return successResponse(res, result, "Login berhasil");
});