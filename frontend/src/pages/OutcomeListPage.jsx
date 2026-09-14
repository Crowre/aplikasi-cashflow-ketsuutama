import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AppIcon from "../components/AppIcon";
import api from "../services/api";
import AlertBox from "../components/AlertBox";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatTanggalIndonesia } from "../utils/formatDate";

const classificationOptions = [
    "BENSIN",
    "KONSUMSI",
    "PERALATAN",
    "PERLENGKAPAN",
    "PENGINAPAN",
    "LAINNYA",
];

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

function OutcomeListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 8 }, (_, index) => currentYear - 5 + index);
    }, []);

    const [items, setItems] = useState([]);
    const [lokasiList, setLokasiList] = useState([]);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [klasifikasi, setKlasifikasi] = useState("");
    const [lokasiid, setLokasiid] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "success" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
                lokasiid:
                    customParams.lokasiid !== undefined ? customParams.lokasiid : lokasiid,
            };

            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            const res = await api.get("/outcome", { params });
            setItems(Array.isArray(res.data.data) ? res.data.data : []);
            setPage(0);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/", {
                    state: { message: "Token tidak valid atau kadaluwarsa", type: "error" },
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

    const handleReset = async () => {
        setSearch("");
        setYear("");
        setKlasifikasi("");
        setLokasiid("");
        setHasSearched(false);
        setPage(0);
        await fetchData({
            search: "",
            year: "",
            klasifikasi: "",
            lokasiid: "",
        });
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            setDeleteLoading(true);
            const res = await api.delete(`/outcome/${selectedId}`);
            setAlert({
                message: res.data.message || "Pengeluaran berhasil dihapus",
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

    const paginatedItems = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return items.slice(startIndex, startIndex + rowsPerPage);
    }, [items, page, rowsPerPage]);

    return (
        <Box className="page-container">
            <Box className="page-heading">
                <Box>
                    <Typography variant="h4" className="page-title">Pengeluaran</Typography>
                    <Typography className="page-subtitle">
                        Kelola seluruh biaya dan pengeluaran perjalanan
                    </Typography>
                </Box>
                <Button
                    component={Link}
                    to="/outcome/create"
                    variant="contained"
                    startIcon={<AppIcon name="add" />}
                    className="primary-action-button"
                >
                    Tambah Pengeluaran
                </Button>
            </Box>

            <AlertBox
                message={alert.message}
                type={alert.type}
                floating={alert.type === "success"}
                onClose={() => setAlert({ message: "", type: "success" })}
            />

            <Card className="filter-card-mui">
                <CardContent>
                    <Stack
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setHasSearched(true);
                            fetchData();
                        }}
                        className="filter-row outcome-filter-row"
                    >
                        <TextField
                            fullWidth
                            label="Cari pengeluaran"
                            placeholder="Deskripsi, lokasi, nominal..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="filter-search-field"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AppIcon name="search" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            select
                            label="Tahun"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="filter-select-year"
                        >
                            <MenuItem value="">Semua</MenuItem>
                            {yearOptions.map((yearOption) => (
                                <MenuItem key={yearOption} value={yearOption}>
                                    {yearOption}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Klasifikasi"
                            value={klasifikasi}
                            onChange={(e) => setKlasifikasi(e.target.value)}
                            className="filter-select-classification"
                        >
                            <MenuItem value="">Semua</MenuItem>
                            {classificationOptions.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Lokasi"
                            value={lokasiid}
                            onChange={(e) => setLokasiid(e.target.value)}
                            className="filter-select-location"
                        >
                            <MenuItem value="">Semua</MenuItem>
                            {lokasiList.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.nama_daerah}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button type="submit" variant="contained" startIcon={<AppIcon name="search" />}>
                            Cari
                        </Button>
                        <Button variant="outlined" onClick={handleReset} startIcon={<AppIcon name="refresh" />}>
                            Reset
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Card className="table-card-mui">
                {loading ? (
                    <Box className="loading-state table-loading-state">
                        <CircularProgress />
                        <Typography>Memuat data...</Typography>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Tanggal</TableCell>
                                        <TableCell>Klasifikasi</TableCell>
                                        <TableCell>Deskripsi</TableCell>
                                        <TableCell>Lokasi</TableCell>
                                        <TableCell align="right">Biaya</TableCell>
                                        <TableCell align="center">Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedItems.length > 0 ? (
                                        paginatedItems.map((item, index) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{formatTanggalIndonesia(item.tanggal_perjalanan)}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={item.klasifikasi_kode}
                                                        variant="outlined"
                                                        color="primary"
                                                        className="classification-chip"
                                                    />
                                                </TableCell>
                                                <TableCell className="description-cell">{item.deskripsi}</TableCell>
                                                <TableCell>{item.lokasi}</TableCell>
                                                <TableCell align="right" className="outcome-money-cell">
                                                    {formatCurrency(item.biaya_pengeluaran)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box className="table-action-group">
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                component={Link}
                                                                to={`/outcome/edit/${item.id}`}
                                                                size="small"
                                                                color="primary"
                                                            >
                                                                <AppIcon name="edit" fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Hapus">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => {
                                                                    setSelectedId(item.id);
                                                                    setDialogOpen(true);
                                                                }}
                                                            >
                                                                <AppIcon name="delete" fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" className="empty-table-cell">
                                                {hasSearched
                                                    ? "Data yang dicari tidak ditemukan."
                                                    : "Belum ada data pengeluaran."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={items.length}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Baris:"
                            className="table-pagination"
                        />
                    </>
                )}
            </Card>

            <ConfirmDialog
                open={dialogOpen}
                title="Hapus data pengeluaran"
                message="Data yang sudah dihapus tidak dapat dikembalikan. Lanjutkan?"
                confirmText="Ya, hapus"
                cancelText="Batal"
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!deleteLoading) {
                        setDialogOpen(false);
                        setSelectedId(null);
                    }
                }}
                loading={deleteLoading}
            />
        </Box>
    );
}

export default OutcomeListPage;
