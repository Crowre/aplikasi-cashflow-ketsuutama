import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";
import { formatTanggalIndonesia } from "../utils/formatDate";

function IncomeEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [originalData, setOriginalData] = useState(null);
    const [form, setForm] = useState({
        tanggal_proyek: "",
        nama_proyek: "",
        jumlah_pemasukan: "",
    });

    const [alert, setAlert] = useState({
        message: "",
        type: "success",
    });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/income/${id}`);
                const data = res.data.data;

                setOriginalData(data);
                setForm({
                    tanggal_proyek: data?.tanggal_proyek?.slice(0, 10) || "",
                    nama_proyek: data?.nama_proyek || "",
                    jumlah_pemasukan: data?.jumlah_pemasukan || "",
                });
            } catch (error) {
                setAlert({
                    message: error.response?.data?.message || "Gagal mengambil detail pemasukan",
                    type: "error",
                });
            }
        };

        fetchDetail();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.tanggal_proyek || !form.nama_proyek || form.jumlah_pemasukan === "") {
            setAlert({
                message: "tanggal_proyek, nama_proyek, dan jumlah_pemasukan wajib diisi",
                type: "error",
            });
            return;
        }

        try {
            const res = await api.put(`/income/${id}`, form);

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
        }
    };

    return (
        <div className="page">
            <div className="card form-card">
                <h2>Edit Data Pemasukan</h2>

                <AlertBox
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ message: "", type: "success" })}
                />

                {originalData && (
                    <div className="preview-box">
                        <h4>Data Lama</h4>
                        <p><strong>Tanggal Proyek:</strong> {formatTanggalIndonesia(originalData.tanggal_proyek)}</p>
                        <p><strong>Nama Proyek:</strong> {originalData.nama_proyek}</p>
                        <p><strong>Jumlah Pemasukan:</strong> {Number(originalData.jumlah_pemasukan).toLocaleString("id-ID")}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form-grid">
                    <label>
                        Tanggal Proyek
                        <input
                            type="date"
                            name="tanggal_proyek"
                            value={form.tanggal_proyek}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Nama Proyek
                        <input
                            type="text"
                            name="nama_proyek"
                            value={form.nama_proyek}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Jumlah Pemasukan
                        <input
                            type="number"
                            name="jumlah_pemasukan"
                            value={form.jumlah_pemasukan}
                            onChange={handleChange}
                        />
                    </label>

                    <div className="form-actions">
                        <button type="submit">Update</button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/income")}
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default IncomeEditPage;