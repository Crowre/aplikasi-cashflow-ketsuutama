import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";

function DashboardPage() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [incomeItems, setIncomeItems] = useState([]);
    const [outcomeItems, setOutcomeItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "success" });

    const fetchDashboardData = async (yearValue = selectedYear) => {
        try {
            setLoading(true);
            const [incomeRes, outcomeRes] = await Promise.all([
                api.get("/income", { params: { year: yearValue } }),
                api.get("/outcome", { params: { year: yearValue } }),
            ]);

            setIncomeItems(Array.isArray(incomeRes.data.data) ? incomeRes.data.data : []);
            setOutcomeItems(Array.isArray(outcomeRes.data.data) ? outcomeRes.data.data : []);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/", {
                    state: { message: "Token tidak valid atau kadaluwarsa", type: "error" },
                });
                return;
            }

            setAlert({
                message: error.response?.data?.message || "Gagal mengambil data dashboard",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData(selectedYear);
    }, []);

    const totalPemasukan = useMemo(() => {
        return incomeItems.reduce((sum, item) => sum + Number(item.jumlahpemasukan || 0), 0);
    }, [incomeItems]);

    const totalPengeluaran = useMemo(() => {
        return outcomeItems.reduce((sum, item) => sum + Number(item.biayapengeluaran || 0), 0);
    }, [outcomeItems]);

    const saldo = totalPemasukan - totalPengeluaran;

    const handleFilter = (e) => {
        e.preventDefault();
        fetchDashboardData(selectedYear);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Dashboard Keuangan</h2>
            </div>

            <AlertBox
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ message: "", type: "success" })}
            />

            <div className="card filter-card">
                <form onSubmit={handleFilter} className="filter-form dashboard-filter-form">
                    <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        placeholder="Masukkan tahun, misalnya 2025"
                    />
                    <button type="submit">Tampilkan</button>
                </form>
            </div>

            {loading ? <div className="card loading-card">Memuat data dashboard...</div> : null}

            <div className="dashboard-grid">
                <div className="card summary-card income-card">
                    <p className="summary-label">Total Pemasukan Tahun {selectedYear}</p>
                    <h3>Rp {totalPemasukan.toLocaleString("id-ID")}</h3>
                </div>

                <div className="card summary-card outcome-card">
                    <p className="summary-label">Total Pengeluaran Tahun {selectedYear}</p>
                    <h3>Rp {totalPengeluaran.toLocaleString("id-ID")}</h3>
                </div>

                <div className="card summary-card saldo-card">
                    <p className="summary-label">Saldo Tahun {selectedYear}</p>
                    <h3>Rp {saldo.toLocaleString("id-ID")}</h3>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;