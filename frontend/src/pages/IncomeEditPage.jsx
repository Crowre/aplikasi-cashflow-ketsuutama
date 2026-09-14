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
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AppIcon from "../components/AppIcon";
import api from "../services/api";
import AlertBox from "../components/AlertBox";

function IncomeEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        tanggal_proyek: "",
        nama_proyek: "",
        jumlah_pemasukan: "",
    });
    const [alert, setAlert] = useState({ message: "", type: "success" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/income/${id}`);
                const data = res.data.data;
                setForm({
                    tanggal_proyek: data?.tanggal_proyek?.slice(0, 10) || "",
                    nama_proyek: data?.nama_proyek || "",
                    jumlah_pemasukan: data?.jumlah_pemasukan ?? "",
                });
            } catch (error) {
                setAlert({
                    message: error.response?.data?.message || "Gagal mengambil detail pemasukan",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.tanggal_proyek || !form.nama_proyek || form.jumlah_pemasukan === "") {
            setAlert({ message: "Semua field wajib diisi.", type: "error" });
            return;
        }

        try {
            setSaving(true);
            const res = await api.put(`/income/${id}`, {
                ...form,
                jumlah_pemasukan: Number(form.jumlah_pemasukan),
            });

            navigate("/income", {
                state: {
                    message: res.data.message || "Pemasukan berhasil diubah",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal mengubah pemasukan",
                type: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box className="page-container form-page">
            <Box className="form-page-inner">
                <Button
                    startIcon={<AppIcon name="back" />}
                    onClick={() => navigate("/income")}
                    className="back-button"
                >
                    Kembali
                </Button>

                <Card className="form-card-mui">
                    <CardContent className="form-card-content">
                        <Typography variant="h5" className="form-title">Edit Pemasukan</Typography>
                        <Typography className="form-subtitle">Perbarui data pemasukan proyek.</Typography>

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
                                    name="tanggal_proyek"
                                    label="Tanggal Proyek"
                                    value={form.tanggal_proyek}
                                    onChange={handleChange}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />

                                <TextField
                                    fullWidth
                                    name="nama_proyek"
                                    label="Nama Proyek"
                                    value={form.nama_proyek}
                                    onChange={handleChange}
                                />

                                <TextField
                                    fullWidth
                                    type="number"
                                    name="jumlah_pemasukan"
                                    label="Jumlah Pemasukan"
                                    value={form.jumlah_pemasukan}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                    }}
                                />

                                <Box className="form-action-row">
                                    <Button variant="outlined" onClick={() => navigate("/income")}>Batal</Button>
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

export default IncomeEditPage;
