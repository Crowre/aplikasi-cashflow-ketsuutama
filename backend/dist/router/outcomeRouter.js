import express from "express";
import {
    indexPengeluaran,
    showPengeluaran,
    storePengeluaran,
    updateDataPengeluaran,
    destroyPengeluaran,
    indexLokasiSumbar,
    showLokasiSumbar
} from "../controller/outcomeController.js";
import { authToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authToken);

router.get("/", indexPengeluaran);
router.get("/lokasi", indexLokasiSumbar);
router.get("/lokasi/:id", showLokasiSumbar);
router.get("/:id", showPengeluaran);
router.post("/", storePengeluaran);
router.put("/:id", updateDataPengeluaran);
router.delete("/:id", destroyPengeluaran);

export default router;