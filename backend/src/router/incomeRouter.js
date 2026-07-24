import express from "express";
import {
    indexPemasukan,
    showPemasukan,
    storePemasukan,
    editPemasukan,
    destroyPemasukan
} from "../controller/incomeController.js";
import { authToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authToken);

router.get("/", indexPemasukan);
router.get("/:id", showPemasukan);
router.post("/", storePemasukan);
router.put("/:id", editPemasukan);
router.delete("/:id", destroyPemasukan);

export default router;