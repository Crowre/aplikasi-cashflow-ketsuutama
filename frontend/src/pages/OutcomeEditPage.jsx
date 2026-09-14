import DateField from "../components/DateField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
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
    "PERLENGKAPAN",
    "PENGINAPAN",
    "LAINNYA",
];

function OutcomeEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lokasiList, setLokasiList] = useState([]);
    const [form, setForm] = useState({
        tanggal_pengeluaran: "",
        klasifikasi_kode: "",
        deskripsi: "",
        biaya_pengeluaran: "",
        lokasi_id: "",
    });
    const [alert, setAlert] = useState({ message: "", type: "success" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailRes, lokasiRes] = await Promise.all([
                    api.get(`/outcome/${id}`),
                    api.get("/outcome/lokasi"),
                ]);

                const data = detailRes.data.data;
                setLokasiList(Array.isArray(lokasiRes.data.data) ? lokasiRes.data.data : []);
                setForm({
                    tanggal_pengeluaran: data?.tanggal_pengeluaran?.slice(0, 10) || "",
                    klasifikasi_kode: data?.klasifikasi_kode || "",
                    deskripsi: data?.deskripsi || "",
                    biaya_pengeluaran: data?.biaya_pengeluaran ?? "",
                    lokasi_id: data?.lokasi_id ? String(data.lokasi_id) : "",
                });
            } catch (error) {
                setAlert({
                    message: error.response?.data?.message || "Gagal mengambil detail pengeluaran",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.tanggal_pengeluaran ||
            !form.klasifikasi_kode ||
            !form.deskripsi ||
            form.biaya_pengeluaran === "" ||
            !form.lokasi_id
        ) {
            setAlert({ message: "Semua field wajib diisi.", type: "error" });
            return;
        }

        try {
            setSaving(true);
            const res = await api.put(`/outcome/${id}`, {
                ...form,
                biaya_pengeluaran: Number(form.biaya_pengeluaran),
            });

            navigate("/outcome", {
                state: {
                    message: res.data.message || "Pengeluaran berhasil diperbarui",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal mengubah pengeluaran",
                type: "error",
            });
        } finally {
            setSaving(false);
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
                        <Typography variant="h5" className="form-title">Edit Pengeluaran</Typography>
                        <Typography className="form-subtitle">Perbarui data pengeluaran.</Typography>

                        <AlertBox
                            message={alert.message}
                            type={alert.type}
                            onClose={() => setAlert({ message: "", type: "success" })}
                        />

                        {loading ? (
                            <Box className="loading-state form-loading-state">
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Stack component="form" onSubmit={handleSubmit} className="mui-form-stack">
                                <DateField
                                    fullWidth
                                    type="date"
                                    name="tanggal_pengeluaran"
                                    label="Tanggal Pengeluaran"
                                    value={form.tanggal_pengeluaran}
                                    onChange={handleChange}
                                    slotProps={{ inputLabel: { shrink: true } }}
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
                                    multiline
                                    minRows={2}
                                    name="deskripsi"
                                    label="Deskripsi"
                                    value={form.deskripsi}
                                    onChange={handleChange}
                                />

                                <TextField
                                    fullWidth
                                    type="number"
                                    name="biaya_pengeluaran"
                                    label="Biaya Pengeluaran"
                                    value={form.biaya_pengeluaran}
                                    onChange={handleChange}
                                    slotProps={{ input: {
                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                    } }}
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
                                        <MenuItem key={item.id} value={String(item.id)}>
                                            {item.nama_daerah}
                                            {item.tipe_daerah ? ` (${item.tipe_daerah})` : ""}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Box className="form-action-row">
                                    <Button variant="outlined" onClick={() => navigate("/outcome")}>Batal</Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<AppIcon name="save" />}
                                        disabled={saving}
                                    >
                                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                                    </Button>
                                </Box>
                            </Stack>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default OutcomeEditPage;
