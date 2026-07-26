import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";

function OutcomeCreatePage() {
    const navigate = useNavigate();
    const [lokasiList, setLokasiList] = useState([]);
    const klasifikasiOptions = ["BENSIN", "KONSUMSI", "PERALATAN", "PENGINAPAN", "PERLENGKAPAN", "LAINNYA"];

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
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/outcome", form);
            navigate("/outcome", {
                state: {
                    message: res.data.message || "Data pengeluaran berhasil ditambahkan",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal menambah pengeluaran",
                type: "error",
            });
        }
    };

    return (
        <div className="page">
            <div className="card form-card">
                <h2>Tambah Data Pengeluaran</h2>

                <AlertBox
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ message: "", type: "success" })}
                />

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
                        <select
                            name="klasifikasi_kode"
                            value={form.klasifikasi_kode}
                            onChange={handleChange}
                        >
                            <option value="">Pilih klasifikasi</option>
                            {klasifikasiOptions.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Deskripsi
                        <input
                            type="text"
                            name="deskripsi"
                            value={form.deskripsi}
                            onChange={handleChange}
                            placeholder="Masukkan deskripsi"
                        />
                    </label>

                    <label>
                        Biaya Pengeluaran
                        <input
                            type="number"
                            name="biaya_pengeluaran"
                            value={form.biaya_pengeluaran}
                            onChange={handleChange}
                            placeholder="Masukkan biaya pengeluaran"
                        />
                    </label>

                    <label>
                        Lokasi
                        <select name="lokasi_id" value={form.lokasi_id} onChange={handleChange}>
                            <option value="">Pilih lokasi</option>
                            {lokasiList.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nama_daerah}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="form-actions">
                        <button type="submit">Simpan</button>
                        <button type="button" className="btn-secondary" onClick={() => navigate("/outcome")}>
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OutcomeCreatePage;