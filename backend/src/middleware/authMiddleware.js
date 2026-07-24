import jwt from "jsonwebtoken";
import db from "../config/database.js";
import { errorResponse } from "../utils/responseHelper.js";

export const authToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse(res, "Token tidak valid atau kadaluwarsa", 401, 108);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const result = await db.query(
            "SELECT id, username, first_name, last_name FROM users WHERE id = $1",
            [decodedToken.id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, "User tidak ditemukan", 401, 108);
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        return errorResponse(res, "Token tidak valid atau kadaluwarsa", 401, 108);
    }
};

export const validationRegistration = (req, res, next) => {
    const { username, password, first_name, last_name } = req.body;

    if (!username || !password || !first_name || !last_name) {
        return errorResponse(
            res,
            "Parameter tidak boleh ada yang kosong",
            400,
            102
        );
    }

    if (String(password).length < 6) {
        return errorResponse(
            res,
            "Password tidak boleh kurang dari 6 karakter",
            400,
            102
        );
    }

    next();
};

export const validationLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return errorResponse(
            res,
            "Username dan password tidak boleh kosong",
            400,
            102
        );
    }

    next();
};