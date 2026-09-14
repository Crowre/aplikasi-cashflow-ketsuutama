// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../services/api";
// import AlertBox from "../components/AlertBox";
// import { formatTanggalIndonesia } from "../utils/formatDate";

// function OutcomeEditPage() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [lokasiList, setLokasiList] = useState([]);
//     const [originalData, setOriginalData] = useState(null);
//     const [form, setForm] = useState({
//         tanggal_perjalanan: "",
//         klasifikasi_kode: "",
//         deskripsi: "",
//         biaya_pengeluaran: "",
//         lokasi_id: "",
//     });

//     const [alert, setAlert] = useState({
//         message: "",
//         type: "success",
//     });

//     const klasifikasiOptions = [
//         "BENSIN",
//         "KONSUMSI",
//         "PERALATAN",
//         "PERLENGKAPAN",
//         "PENGINAPAN",
//         "LAINNYA",
//     ];

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [detailRes, lokasiRes] = await Promise.all([
//                     api.get(`/outcome/${id}`),
//                     api.get("/outcome/lokasi"),
//                 ]);

//                 const data = detailRes.data.data;
//                 setOriginalData(data);
//                 setLokasiList(Array.isArray(lokasiRes.data.data) ? lokasiRes.data.data : []);

//                 setForm({
//                     tanggal_perjalanan: data?.tanggal_perjalanan?.slice(0, 10) || "",
//                     klasifikasi_kode: data?.klasifikasi_kode || "",
//                     deskripsi: data?.deskripsi || "",
//                     biaya_pengeluaran: data?.biaya_pengeluaran ?? "",
//                     lokasi_id: data?.lokasi_id ? String(data.lokasi_id) : "",
//                 });
//             } catch (error) {
//                 setAlert({
//                     message: error.response?.data?.message || "Gagal mengambil detail pengeluaran",
//                     type: "error",
//                 });
//             }
//         };

//         fetchData();
//     }, [id]);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (
//             !form.tanggal_perjalanan ||
//             !form.klasifikasi_kode ||
//             !form.deskripsi ||
//             form.biaya_pengeluaran === "" ||
//             !form.lokasi_id
//         ) {
//             setAlert({
//                 message: "Semua field wajib diisi",
//                 type: "error",
//             });
//             return;
//         }

//         try {
//             const res = await api.put(`/outcome/${id}`, form);

//             navigate("/outcome", {
//                 state: {
//                     message: res.data.message || "Data pengeluaran berhasil diperbarui",
//                     type: "success",
//                 },
//             });
//         } catch (error) {
//             setAlert({
//                 message: error.response?.data?.message || "Gagal mengubah pengeluaran",
//                 type: "error",
//             });
//         }
//     };

//     return (
//         <div className="page">
//             <div className="card form-card">
//                 <h2>Edit Data Pengeluaran</h2>

//                 <AlertBox
//                     message={alert.message}
//                     type={alert.type}
//                     onClose={() => setAlert({ message: "", type: "success" })}
//                 />

//                 {originalData && (
//                     <div className="preview-box">
//                         <h4>Data Lama</h4>
//                         <p>
//                             <strong>Tanggal Perjalanan:</strong>{" "}
//                             {formatTanggalIndonesia(originalData.tanggal_perjalanan)}
//                         </p>
//                         <p>
//                             <strong>Klasifikasi:</strong> {originalData.klasifikasi_kode}
//                         </p>
//                         <p>
//                             <strong>Deskripsi:</strong> {originalData.deskripsi}
//                         </p>
//                         <p>
//                             <strong>Biaya:</strong>{" "}
//                             {Number(originalData.biaya_pengeluaran).toLocaleString("id-ID")}
//                         </p>
//                         <p>
//                             <strong>Lokasi:</strong> {originalData.lokasi}
//                         </p>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="form-grid">
//                     <label>
//                         Tanggal Perjalanan
//                         <input
//                             type="date"
//                             name="tanggal_perjalanan"
//                             value={form.tanggal_perjalanan}
//                             onChange={handleChange}
//                         />
//                     </label>

//                     <label>
//                         Klasifikasi Kode
//                         <select
//                             name="klasifikasi_kode"
//                             value={form.klasifikasi_kode}
//                             onChange={handleChange}
//                         >
//                             <option value="">Pilih klasifikasi</option>
//                             {klasifikasiOptions.map((item) => (
//                                 <option key={item} value={item}>
//                                     {item}
//                                 </option>
//                             ))}
//                         </select>
//                     </label>

//                     <label>
//                         Deskripsi
//                         <input
//                             type="text"
//                             name="deskripsi"
//                             value={form.deskripsi}
//                             onChange={handleChange}
//                             placeholder="Masukkan deskripsi"
//                         />
//                     </label>

//                     <label>
//                         Biaya Pengeluaran
//                         <input
//                             type="number"
//                             name="biaya_pengeluaran"
//                             value={form.biaya_pengeluaran}
//                             onChange={handleChange}
//                             placeholder="Masukkan biaya pengeluaran"
//                         />
//                     </label>

//                     <label>
//                         Lokasi
//                         <select name="lokasi_id" value={form.lokasi_id} onChange={handleChange}>
//                             <option value="">Pilih lokasi</option>
//                             {lokasiList.map((item) => (
//                                 <option key={item.id} value={String(item.id)}>
//                                     {item.nama_daerah} ({item.tipe_daerah})
//                                 </option>
//                             ))}
//                         </select>
//                     </label>

//                     <div className="form-actions">
//                         <button type="submit">Update</button>
//                         <button
//                             type="button"
//                             className="btn-secondary"
//                             onClick={() => navigate("/outcome")}
//                         >
//                             Batal
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default OutcomeEditPage;

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
        tanggal_perjalanan: "",
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
                    tanggal_perjalanan: data?.tanggal_perjalanan?.slice(0, 10) || "",
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
