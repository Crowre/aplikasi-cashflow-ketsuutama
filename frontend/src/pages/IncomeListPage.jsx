import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatTanggalIndonesia } from "../utils/formatDate";

function IncomeListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [alert, setAlert] = useState({
        message: "",
        type: "success",
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async (customParams = {}) => {
        try {
            setLoading(true);

            const params = {
                search: customParams.search !== undefined ? customParams.search : search,
                year: customParams.year !== undefined ? customParams.year : year,
            };

            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            const res = await api.get("/income", { params });
            const data = Array.isArray(res.data.data) ? res.data.data : [];
            setItems(data);
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
        } finally {
            setLoading(false);
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

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setHasSearched(true);
        setCurrentPage(1);
        await fetchData();
    };

    const handleReset = async () => {
        setSearch("");
        setYear("");
        setHasSearched(false);
        setCurrentPage(1);
        await fetchData({ search: "", year: "" });
    };

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
            await fetchData();
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal menghapus data pemasukan",
                type: "error",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const totalPages = Math.ceil(items.length / itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    }, [items, currentPage]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="pagination">
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={page === currentPage ? "pagination-btn active" : "pagination-btn"}
                        onClick={() => goToPage(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
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

            <div className="card filter-card">
                <form onSubmit={handleSearchSubmit} className="filter-form">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama proyek atau nominal"
                    />
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Filter tahun, misalnya 2025"
                    />
                    <button type="submit">Cari</button>
                    <button type="button" className="btn-secondary" onClick={handleReset}>
                        Reset
                    </button>
                </form>
            </div>

            {loading ? <div className="card loading-card">Memuat data...</div> : null}

            <div className="card table-card desktop-only">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tanggal Proyek</th>
                                <th>Nama Proyek</th>
                                <th>Jumlah Pemasukan (Rp)</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                                        {hasSearched ? "Data yang disortir tidak ditemukan" : "Belum ada data pemasukan"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mobile-list mobile-only">
                {paginatedItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
                        <div key={item.id} className="mobile-item-card">
                            <div className="mobile-item-row">
                                <span className="mobile-label">No</span>
                                <span className="mobile-value">{(currentPage - 1) * itemsPerPage + index + 1}</span>
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
                    <div className="card empty-mobile-card">
                        {hasSearched ? "Data yang disortir tidak ditemukan" : "Belum ada data pemasukan"}
                    </div>
                )}
            </div>

            {renderPagination()}

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