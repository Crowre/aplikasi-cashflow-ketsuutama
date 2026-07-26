import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";

function IncomeCreatePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        tanggal_proyek: "",
        nama_proyek: "",
        jumlah_pemasukan: "",
    });

    const [alert, setAlert] = useState({
        message: "",
        type: "success",
    });

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
            const payload = {
                tanggal_proyek: form.tanggal_proyek,
                nama_proyek: form.nama_proyek,
                jumlah_pemasukan: Number(form.jumlah_pemasukan),
            };

            const res = await api.post("/income", payload);

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
        }
    };

    return (
        <div className="page">
            <div className="card form-card">
                <h2>Tambah Data Pemasukan</h2>

                <AlertBox
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ message: "", type: "success" })}
                />

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
                            placeholder="Masukkan nama proyek"
                        />
                    </label>

                    <label>
                        Jumlah Pemasukan
                        <input
                            type="number"
                            name="jumlah_pemasukan"
                            value={form.jumlah_pemasukan}
                            onChange={handleChange}
                            placeholder="Masukkan jumlah pemasukan"
                        />
                    </label>

                    <div className="form-actions">
                        <button type="submit">Simpan</button>
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

export default IncomeCreatePage;