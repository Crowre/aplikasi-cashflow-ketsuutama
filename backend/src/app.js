import express from "express";
import dotenv from "dotenv";
import authRouter from "./router/authRouter.js";
import incomeRouter from "./router/incomeRouter.js";
import outcomeRouter from "./router/outcomeRouter.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET belum diset di file .env");
}

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN wajib diisi untuk production");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins }));

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server running",
    data: null,
  });
});

app.use("/auth", authRouter);
app.use("/income", incomeRouter);
app.use("/outcome", outcomeRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
