import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser } from "../model/authModel.js";
import { AppError } from "../utils/appError.js";

export const registerUser = async ({
    username,
    password,
    first_name,
    last_name,
}) => {
    const existingUser = await findUserByUsername(username);

    if (existingUser) {
        throw new AppError("Username sudah terdaftar", 409, 101);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
        username: String(username).trim(),
        password: hashedPassword,
        first_name: String(first_name).trim(),
        last_name: String(last_name).trim(),
    });

    return newUser;
};

export const loginUser = async ({ username, password }) => {
    const user = await findUserByUsername(username);

    if (!user) {
        throw new AppError("Username yang dimasukkan tidak terdaftar", 401, 108);
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw new AppError("Password yang dimasukkan salah", 401, 108);
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    return { token };
};