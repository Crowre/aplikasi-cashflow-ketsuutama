import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";
import { formatTanggalIndonesia } from "../utils/formatDate";

function OutcomeEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lokasiList, setLokasiList] = useState([]);
    const [originalData, setOriginalData] = useState(null);
    const [form, setForm] = useState({
        tanggal_perjalanan: "",
        klasifikasi_kode: "",
        deskripsi: "",
        biaya_pengeluaran: "",
        lokasi_id: "",
    });

    const [alert, setAlert] = useState({
        message: "",
        type: "success",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailRes, lokasiRes] = await Promise.all([
                    api.get(`/outcome/${id}`),
                    api.get("/outcome/lokasi"),
                ]);

                const data = detailRes.data.data;
                setOriginalData(data);
                setLokasiList(Array.isArray(lokasiRes.data.data) ? lokasiRes.data.data : []);

                setForm({
                    tanggal_perjalanan: data?.tanggal_perjalanan?.slice(0, 10) || "",
                    klasifikasi_kode: data?.klasifikasi_kode || "",
                    deskripsi: data?.deskripsi || "",
                    biaya_pengeluaran: data?.biaya_pengeluaran || "",
                    lokasi_id: data?.lokasi_id || "",
                });
            } catch (error) {
                setAlert({
                    message: error.response?.data?.message || "Gagal mengambil detail pengeluaran",
                    type: "error",
                });
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.put(`/outcome/${id}`, form);

            navigate("/outcome", {
                state: {
                    message: res.data.message || "Data pengeluaran berhasil diperbarui",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal mengubah pengeluaran",
                type: "error",
            });
        }
    };

    return (
        <div className="page">
            <div className="card form-card">
                <h2>Edit Data Pengeluaran</h2>

                <AlertBox
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ message: "", type: "success" })}
                />

                {originalData && (
                    <div className="preview-box">
                        <h4>Data Lama</h4>
                        <p><strong>Tanggal Perjalanan:</strong> {formatTanggalIndonesia(originalData.tanggal_perjalanan)}</p>
                        <p><strong>Klasifikasi:</strong> {originalData.klasifikasi_kode}</p>
                        <p><strong>Deskripsi:</strong> {originalData.deskripsi}</p>
                        <p><strong>Biaya:</strong> {Number(originalData.biaya_pengeluaran).toLocaleString("id-ID")}</p>
                        <p><strong>Lokasi:</strong> {originalData.lokasi}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form-grid">
                    <label>
                        Tanggal Perjalanan
                        <input
                            type="date"
                            name="tanggal_perjalanan"
                            value={form.tanggal_perjalanan}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Klasifikasi Kode
                        <input
                            type="text"
                            name="klasifikasi_kode"
                            value={form.klasifikasi_kode}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Deskripsi
                        <input
                            type="text"
                            name="deskripsi"
                            value={form.deskripsi}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Biaya Pengeluaran
                        <input
                            type="number"
                            name="biaya_pengeluaran"
                            value={form.biaya_pengeluaran}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Lokasi
                        <select name="lokasi_id" value={form.lokasi_id} onChange={handleChange}>
                            <option value="">Pilih lokasi</option>
                            {lokasiList.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nama_daerah} ({item.tipe_daerah})
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="form-actions">
                        <button type="submit">Update</button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/outcome")}
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OutcomeEditPage;