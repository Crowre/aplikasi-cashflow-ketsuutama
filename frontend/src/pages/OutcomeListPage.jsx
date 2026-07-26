import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatTanggalIndonesia } from "../utils/formatDate";

function OutcomeListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [items, setItems] = useState([]);
    const [lokasiList, setLokasiList] = useState([]);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [klasifikasi, setKlasifikasi] = useState("");
    const [lokasiid, setLokasiid] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [alert, setAlert] = useState({
        message: "",
        type: "success",
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const klasifikasiOptions = [
        "BENSIN",
        "KONSUMSI",
        "PERALATAN",
        "PERLENGKAPAN",
        "PENGINAPAN",
        "LAINNYA",
    ];

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

    const fetchData = async (customParams = {}) => {
        try {
            setLoading(true);

            const params = {
                search: customParams.search !== undefined ? customParams.search : search,
                year: customParams.year !== undefined ? customParams.year : year,
                klasifikasi:
                    customParams.klasifikasi !== undefined
                        ? customParams.klasifikasi
                        : klasifikasi,
                lokasiid: customParams.lokasiid !== undefined ? customParams.lokasiid : lokasiid,
            };

            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            const res = await api.get("/outcome", { params });
            const data = Array.isArray(res.data.data) ? res.data.data : [];
            setItems(data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/", {
                    state: {
                        message: "Token tidak valid atau kadaluwarsa",
                        type: "error",
                    },
                });
                return;
            }

            setAlert({
                message: error.response?.data?.message || "Gagal mengambil data pengeluaran",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLokasi();
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
        setKlasifikasi("");
        setLokasiid("");
        setHasSearched(false);
        setCurrentPage(1);
        await fetchData({ search: "", year: "", klasifikasi: "", lokasiid: "" });
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
            const res = await api.delete(`/outcome/${selectedId}`);

            setAlert({
                message: res.data.message || "Data pengeluaran berhasil dihapus",
                type: "success",
            });

            setDialogOpen(false);
            setSelectedId(null);
            await fetchData();
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Gagal menghapus data pengeluaran",
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
                <h2>Data Pengeluaran</h2>
                <Link to="/outcome/create" className="btn-primary-link">
                    Create
                </Link>
            </div>

            <AlertBox
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ message: "", type: "success" })}
            />

            <div className="card filter-card">
                <form onSubmit={handleSearchSubmit} className="filter-form filter-form-outcome">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari deskripsi, lokasi, klasifikasi, atau nominal"
                    />
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Filter tahun, misalnya 2025"
                    />
                    <select value={klasifikasi} onChange={(e) => setKlasifikasi(e.target.value)}>
                        <option value="">Semua klasifikasi</option>
                        {klasifikasiOptions.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <select value={lokasiid} onChange={(e) => setLokasiid(e.target.value)}>
                        <option value="">Semua lokasi</option>
                        {lokasiList.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nama_daerah} ({item.tipe_daerah})
                            </option>
                        ))}
                    </select>
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
                                <th>Tanggal Perjalanan</th>
                                <th>Klasifikasi</th>
                                <th>Deskripsi</th>
                                <th>Biaya Pengeluaran (Rp)</th>
                                <th>Lokasi</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{formatTanggalIndonesia(item.tanggal_perjalanan)}</td>
                                        <td>{item.klasifikasi_kode}</td>
                                        <td>{item.deskripsi}</td>
                                        <td>{Number(item.biaya_pengeluaran).toLocaleString("id-ID")}</td>
                                        <td>{item.lokasi}</td>
                                        <td>
                                            <div className="action-group">
                                                <Link to={`/outcome/edit/${item.id}`} className="btn-warning-link">
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
                                    <td colSpan="7" className="empty-cell">
                                        {hasSearched ? "Data yang disortir tidak ditemukan" : "Belum ada data pengeluaran"}
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
                                <span className="mobile-label">Tanggal</span>
                                <span className="mobile-value">{formatTanggalIndonesia(item.tanggal_perjalanan)}</span>
                            </div>
                            <div className="mobile-item-row">
                                <span className="mobile-label">Klasifikasi</span>
                                <span className="mobile-value">{item.klasifikasi_kode}</span>
                            </div>
                            <div className="mobile-item-row">
                                <span className="mobile-label">Deskripsi</span>
                                <span className="mobile-value">{item.deskripsi}</span>
                            </div>
                            <div className="mobile-item-row">
                                <span className="mobile-label">Biaya</span>
                                <span className="mobile-value">
                                    {Number(item.biaya_pengeluaran).toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="mobile-item-row">
                                <span className="mobile-label">Lokasi</span>
                                <span className="mobile-value">{item.lokasi}</span>
                            </div>
                            <div className="mobile-action-group">
                                <Link to={`/outcome/edit/${item.id}`} className="btn-warning-link full-width-btn">
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
                        {hasSearched ? "Data yang disortir tidak ditemukan" : "Belum ada data pengeluaran"}
                    </div>
                )}
            </div>

            {renderPagination()}

            <ConfirmDialog
                open={dialogOpen}
                title="Hapus data pengeluaran"
                message="Apakah anda yakin ingin menghapus data pengeluaran ini?"
                confirmText="Ya, hapus"
                cancelText="Tidak"
                onConfirm={handleDelete}
                onCancel={closeDeleteDialog}
                loading={deleteLoading}
            />
        </div>
    );
}

export default OutcomeListPage;