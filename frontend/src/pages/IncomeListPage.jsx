import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
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

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

function IncomeListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 8 }, (_, index) => currentYear - 5 + index);
    }, []);

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("");
    const [alert, setAlert] = useState({ message: "", type: "success" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    const handleReset = async () => {
        setSearch("");
        setYear("");
        setHasSearched(false);
        setPage(0);
        await fetchData({ search: "", year: "" });
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

    const paginatedItems = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return items.slice(startIndex, startIndex + rowsPerPage);
    }, [items, page, rowsPerPage]);

    return (
        <Box className="page-container">
            <Box className="page-heading">
                <Box>
                    <Typography variant="h4" className="page-title">Pemasukan</Typography>
                    <Typography className="page-subtitle">
                        Kelola seluruh data pemasukan proyek
                    </Typography>
                </Box>
                <Button
                    component={Link}
                    to="/income/create"
                    variant="contained"
                    startIcon={<AppIcon name="add" />}
                    className="primary-action-button"
                >
                    Tambah Pemasukan
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
                        className="filter-row income-filter-row"
                    >
                        <TextField
                            fullWidth
                            label="Cari pemasukan"
                            placeholder="Nama proyek atau nominal..."
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
                            <MenuItem value="">Semua tahun</MenuItem>
                            {yearOptions.map((yearOption) => (
                                <MenuItem key={yearOption} value={yearOption}>
                                    {yearOption}
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
                                        <TableCell>Tanggal Proyek</TableCell>
                                        <TableCell>Nama Proyek</TableCell>
                                        <TableCell align="right">Jumlah Pemasukan</TableCell>
                                        <TableCell align="center">Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedItems.length > 0 ? (
                                        paginatedItems.map((item, index) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{formatTanggalIndonesia(item.tanggal_proyek)}</TableCell>
                                                <TableCell className="table-primary-text">{item.nama_proyek}</TableCell>
                                                <TableCell align="right" className="income-money-cell">
                                                    {formatCurrency(item.jumlah_pemasukan)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box className="table-action-group">
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                component={Link}
                                                                to={`/income/edit/${item.id}`}
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
                                            <TableCell colSpan={5} align="center" className="empty-table-cell">
                                                {hasSearched
                                                    ? "Data yang dicari tidak ditemukan."
                                                    : "Belum ada data pemasukan."}
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
                title="Hapus data pemasukan"
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

export default IncomeListPage;
