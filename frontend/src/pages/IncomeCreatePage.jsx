// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import AlertBox from "../components/AlertBox";

// function IncomeCreatePage() {
//     const navigate = useNavigate();

//     const [form, setForm] = useState({
//         tanggal_proyek: "",
//         nama_proyek: "",
//         jumlah_pemasukan: "",
//     });

//     const [alert, setAlert] = useState({
//         message: "",
//         type: "success",
//     });

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!form.tanggal_proyek || !form.nama_proyek || form.jumlah_pemasukan === "") {
//             setAlert({
//                 message: "tanggal_proyek, nama_proyek, dan jumlah_pemasukan wajib diisi",
//                 type: "error",
//             });
//             return;
//         }

//         try {
//             const payload = {
//                 tanggal_proyek: form.tanggal_proyek,
//                 nama_proyek: form.nama_proyek,
//                 jumlah_pemasukan: Number(form.jumlah_pemasukan),
//             };

//             const res = await api.post("/income", payload);

//             navigate("/income", {
//                 state: {
//                     message: res.data.message || "Pemasukan berhasil ditambahkan",
//                     type: "success",
//                 },
//             });
//         } catch (error) {
//             setAlert({
//                 message: error.response?.data?.message || "Gagal menambah pemasukan",
//                 type: "error",
//             });
//         }
//     };

//     return (
//         <div className="page">
//             <div className="card form-card">
//                 <h2>Tambah Data Pemasukan</h2>

//                 <AlertBox
//                     message={alert.message}
//                     type={alert.type}
//                     onClose={() => setAlert({ message: "", type: "success" })}
//                 />

//                 <form onSubmit={handleSubmit} className="form-grid">
//                     <label>
//                         Tanggal Proyek
//                         <input
//                             type="date"
//                             name="tanggal_proyek"
//                             value={form.tanggal_proyek}
//                             onChange={handleChange}
//                         />
//                     </label>

//                     <label>
//                         Nama Proyek
//                         <input
//                             type="text"
//                             name="nama_proyek"
//                             value={form.nama_proyek}
//                             onChange={handleChange}
//                             placeholder="Masukkan nama proyek"
//                         />
//                     </label>

//                     <label>
//                         Jumlah Pemasukan
//                         <input
//                             type="number"
//                             name="jumlah_pemasukan"
//                             value={form.jumlah_pemasukan}
//                             onChange={handleChange}
//                             placeholder="Masukkan jumlah pemasukan"
//                         />
//                     </label>

//                     <div className="form-actions">
//                         <button type="submit">Simpan</button>
//                         <button
//                             type="button"
//                             className="btn-secondary"
//                             onClick={() => navigate("/income")}
//                         >
//                             Batal
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default IncomeCreatePage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AppIcon from "../components/AppIcon";
import api from "../services/api";
import AlertBox from "../components/AlertBox";

function IncomeCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        tanggal_proyek: "",
        nama_proyek: "",
        jumlah_pemasukan: "",
    });
    const [alert, setAlert] = useState({ message: "", type: "success" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.tanggal_proyek || !form.nama_proyek || form.jumlah_pemasukan === "") {
            setAlert({
                message: "Tanggal proyek, nama proyek, dan jumlah pemasukan wajib diisi.",
                type: "error",
            });
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/income", {
                tanggal_proyek: form.tanggal_proyek,
                nama_proyek: form.nama_proyek,
                jumlah_pemasukan: Number(form.jumlah_pemasukan),
            });

            navigate("/income", {
                state: {
                    message: res.data.message || "Pemasukan berhasil ditambahkan",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal menambah pemasukan",
                type: "error",
            });
        } finally {
            setLoading(false);
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
                        <Typography variant="h5" className="form-title">
                            Tambah Pemasukan
                        </Typography>
                        <Typography className="form-subtitle">
                            Masukkan informasi pemasukan proyek.
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
                                name="tanggal_proyek"
                                label="Tanggal Proyek"
                                value={form.tanggal_proyek}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                fullWidth
                                name="nama_proyek"
                                label="Nama Proyek"
                                placeholder="Contoh: Konsultansi Perencanaan"
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
                                    disabled={loading}
                                >
                                    {loading ? "Menyimpan..." : "Simpan Pemasukan"}
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default IncomeCreatePage;
