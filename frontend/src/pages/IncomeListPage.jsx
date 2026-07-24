import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatTanggalIndonesia } from "../utils/formatDate";

function IncomeListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [items, setItems] = useState([]);
    const [alert, setAlert] = useState({
        message: "",
        type: "success",
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get("/income");
            const data = Array.isArray(res.data.data) ? res.data.data : [];

            const sorted = [...data].sort(
                (a, b) => new Date(a.tanggal_proyek) - new Date(b.tanggal_proyek)
            );

            setItems(sorted);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/", {
                    state: { message: "Token tidak valid atau kadaluwarsa", type: "error" },
                });
                return;
            }

            setAlert({
                message: error.response?.data?.message || "Gagal mengambil data pemasukan",
                type: "error",
            });
        }
    };

    useEffect(() => {
        fetchData();

        if (location.state?.message) {
            setAlert({
                message: location.state.message,
                type: location.state.type || "success",
            });
            window.history.replaceState({}, document.title);
        }
    }, []);

    const openDeleteDialog = (id) => {
        setSelectedId(id);
        setDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        if (deleteLoading) return;
        setDialogOpen(false);
        setSelectedId(null);
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            setDeleteLoading(true);
            const res = await api.delete(`/income/${selectedId}`);

            setAlert({
                message: res.data.message || "Pemasukan berhasil dihapus",
                type: "success",
            });

            setDialogOpen(false);
            setSelectedId(null);
            fetchData();
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal menghapus data pemasukan",
                type: "error",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Data Pemasukan</h2>
                <Link to="/income/create" className="btn-primary-link">
                    Create
                </Link>
            </div>

            <AlertBox
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ message: "", type: "success" })}
            />

            <div className="card table-card desktop-only">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tanggal Proyek</th>
                                <th>Nama Proyek</th>
                                <th>Jumlah Pemasukan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{formatTanggalIndonesia(item.tanggal_proyek)}</td>
                                        <td>{item.nama_proyek}</td>
                                        <td>{Number(item.jumlah_pemasukan).toLocaleString("id-ID")}</td>
                                        <td>
                                            <div className="action-group">
                                                <Link to={`/income/edit/${item.id}`} className="btn-warning-link">
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn-danger"
                                                    onClick={() => openDeleteDialog(item.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-cell">
                                        Belum ada data pemasukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mobile-list mobile-only">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="mobile-item-card">
                            <div className="mobile-item-row">
                                <span className="mobile-label">ID</span>
                                <span className="mobile-value">{item.id}</span>
                            </div>
                            <div className="mobile-item-row">
                                <span className="mobile-label">Tanggal Proyek</span>
                                <span className="mobile-value">{formatTanggalIndonesia(item.tanggal_proyek)}</span>
                            </div>
                            <div className="mobile-item-row">
                                <span className="mobile-label">Nama Proyek</span>
                                <span className="mobile-value">{item.nama_proyek}</span>
                            </div>
                            <div className="mobile-item-row">
                                <span className="mobile-label">Jumlah</span>
                                <span className="mobile-value">
                                    {Number(item.jumlah_pemasukan).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="mobile-action-group">
                                <Link to={`/income/edit/${item.id}`} className="btn-warning-link full-width-btn">
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    className="btn-danger full-width-btn"
                                    onClick={() => openDeleteDialog(item.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="card empty-mobile-card">Belum ada data pemasukan</div>
                )}
            </div>

            <ConfirmDialog
                open={dialogOpen}
                title="Hapus data pemasukan"
                message="Apakah anda yakin ingin menghapus data pemasukan ini?"
                confirmText="Ya, hapus"
                cancelText="Tidak"
                onConfirm={handleDelete}
                onCancel={closeDeleteDialog}
                loading={deleteLoading}
            />
        </div>
    );
}

export default IncomeListPage;