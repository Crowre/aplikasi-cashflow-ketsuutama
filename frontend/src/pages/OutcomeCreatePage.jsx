import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AppIcon from "../components/AppIcon";
import api from "../services/api";
import AlertBox from "../components/AlertBox";

const classificationOptions = [
    "BENSIN",
    "KONSUMSI",
    "PERALATAN",
    "PENGINAPAN",
    "PERLENGKAPAN",
    "LAINNYA",
];

function OutcomeCreatePage() {
    const navigate = useNavigate();
    const [lokasiList, setLokasiList] = useState([]);
    const [form, setForm] = useState({
        tanggal_perjalanan: "",
        klasifikasi_kode: "",
        deskripsi: "",
        biaya_pengeluaran: "",
        lokasi_id: "",
    });
    const [alert, setAlert] = useState({ message: "", type: "success" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLokasi = async () => {
            try {
                const res = await api.get("/outcome/lokasi");
                setLokasiList(Array.isArray(res.data.data) ? res.data.data : []);
            } catch (error) {
                setAlert({
                    message: error.response?.data?.message || "Gagal mengambil data lokasi",
                    type: "error",
                });
            }
        };

        fetchLokasi();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.tanggal_perjalanan ||
            !form.klasifikasi_kode ||
            !form.deskripsi ||
            form.biaya_pengeluaran === "" ||
            !form.lokasi_id
        ) {
            setAlert({ message: "Semua field wajib diisi.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/outcome", {
                ...form,
                biaya_pengeluaran: Number(form.biaya_pengeluaran),
            });

            navigate("/outcome", {
                state: {
                    message: res.data.message || "Pengeluaran berhasil ditambahkan",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal menambah pengeluaran",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="page-container form-page">
            <Box className="form-page-inner form-page-inner-wide">
                <Button
                    startIcon={<AppIcon name="back" />}
                    onClick={() => navigate("/outcome")}
                    className="back-button"
                >
                    Kembali
                </Button>

                <Card className="form-card-mui">
                    <CardContent className="form-card-content">
                        <Typography variant="h5" className="form-title">Tambah Pengeluaran</Typography>
                        <Typography className="form-subtitle">
                            Catat biaya perjalanan atau operasional.
                        </Typography>

                        <AlertBox
                            message={alert.message}
                            type={alert.type}
                            onClose={() => setAlert({ message: "", type: "success" })}
                        />

                        <Stack component="form" onSubmit={handleSubmit} className="mui-form-stack">
                            <TextField
                                fullWidth
                                type="date"
                                name="tanggal_perjalanan"
                                label="Tanggal Perjalanan"
                                value={form.tanggal_perjalanan}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                select
                                fullWidth
                                name="klasifikasi_kode"
                                label="Klasifikasi"
                                value={form.klasifikasi_kode}
                                onChange={handleChange}
                            >
                                {classificationOptions.map((item) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                name="deskripsi"
                                label="Deskripsi"
                                multiline
                                minRows={2}
                                value={form.deskripsi}
                                onChange={handleChange}
                                placeholder="Contoh: BBM perjalanan Padang - Bukittinggi"
                            />

                            <TextField
                                fullWidth
                                type="number"
                                name="biaya_pengeluaran"
                                label="Biaya Pengeluaran"
                                value={form.biaya_pengeluaran}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                }}
                            />

                            <TextField
                                select
                                fullWidth
                                name="lokasi_id"
                                label="Lokasi"
                                value={form.lokasi_id}
                                onChange={handleChange}
                            >
                                {lokasiList.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.nama_daerah}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Box className="form-action-row">
                                <Button variant="outlined" onClick={() => navigate("/outcome")}>Batal</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<AppIcon name="save" />}
                                    disabled={loading}
                                >
                                    {loading ? "Menyimpan..." : "Simpan Pengeluaran"}
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default OutcomeCreatePage;
