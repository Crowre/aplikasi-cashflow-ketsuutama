// import { useEffect, useMemo, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//     Box,
//     Card,
//     CardContent,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TablePagination,
//     TextField,
//     Button,
//     Typography,
//     CircularProgress,
//     Grid,
//     IconButton,
//     InputAdornment,
//     MenuItem,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import api from "../services/api";
// import AlertBox from "../components/AlertBox";
// import ConfirmDialog from "../components/ConfirmDialog";
// import { formatTanggalIndonesia } from "../utils/formatDate";

// function IncomeListPage() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const currentYear = new Date().getFullYear();

//     // Generate tahun dari 2020 sampai 2030
//     const yearOptions = useMemo(() => {
//         const years = [];
//         for (let year = 2020; year <= 2030; year++) {
//             years.push(year);
//         }
//         return years;
//     }, []);

//     const [items, setItems] = useState([]);
//     const [search, setSearch] = useState("");
//     const [year, setYear] = useState("");
//     const [alert, setAlert] = useState({
//         message: "",
//         type: "success",
//     });
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [selectedId, setSelectedId] = useState(null);
//     const [deleteLoading, setDeleteLoading] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     const fetchData = async (customParams = {}) => {
//         try {
//             setLoading(true);

//             const params = {
//                 search: customParams.search !== undefined ? customParams.search : search,
//                 year: customParams.year !== undefined ? customParams.year : year,
//             };

//             Object.keys(params).forEach((key) => {
//                 if (!params[key]) delete params[key];
//             });

//             const res = await api.get("/income", { params });
//             const data = Array.isArray(res.data.data) ? res.data.data : [];
//             setItems(data);
//             setPage(0);
//         } catch (error) {
//             if (error.response?.status === 401) {
//                 localStorage.removeItem("token");
//                 navigate("/", {
//                     state: { message: "Token tidak valid atau kadaluwarsa", type: "error" },
//                 });
//                 return;
//             }

//             setAlert({
//                 message: error.response?.data?.message || "Gagal mengambil data pemasukan",
//                 type: "error",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();

//         if (location.state?.message) {
//             setAlert({
//                 message: location.state.message,
//                 type: location.state.type || "success",
//             });
//             window.history.replaceState({}, document.title);
//         }
//     }, []);

//     const handleSearchSubmit = async (e) => {
//         e.preventDefault();
//         setHasSearched(true);
//         await fetchData();
//     };

//     const handleReset = async () => {
//         setSearch("");
//         setYear("");
//         setHasSearched(false);
//         setPage(0);
//         await fetchData({ search: "", year: "" });
//     };

//     const openDeleteDialog = (id) => {
//         setSelectedId(id);
//         setDialogOpen(true);
//     };

//     const closeDeleteDialog = () => {
//         if (deleteLoading) return;
//         setDialogOpen(false);
//         setSelectedId(null);
//     };

//     const handleDelete = async () => {
//         if (!selectedId) return;

//         try {
//             setDeleteLoading(true);
//             const res = await api.delete(`/income/${selectedId}`);

//             setAlert({
//                 message: res.data.message || "Pemasukan berhasil dihapus",
//                 type: "success",
//             });

//             setDialogOpen(false);
//             setSelectedId(null);
//             await fetchData();
//         } catch (error) {
//             setAlert({
//                 message: error.response?.data?.message || "Gagal menghapus data pemasukan",
//                 type: "error",
//             });
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const paginatedItems = useMemo(() => {
//         const startIndex = page * rowsPerPage;
//         return items.slice(startIndex, startIndex + rowsPerPage);
//     }, [items, page, rowsPerPage]);

//     const formatCurrency = (value) => {
//         return new Intl.NumberFormat("id-ID", {
//             style: "currency",
//             currency: "IDR",
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//         }).format(value);
//     };

//     return (
//         <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
//             {/* Header */}
//             <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
//                 <Typography variant="h4" component="h2" fontWeight="bold">
//                     Data Pemasukan
//                 </Typography>
//                 <Button
//                     component={Link}
//                     to="/income/create"
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     sx={{
//                         textTransform: 'none',
//                         fontWeight: 600,
//                         px: 3,
//                         py: 1,
//                     }}
//                 >
//                     Tambah Pemasukan
//                 </Button>
//             </Box>

//             {/* AlertBox */}
//             <AlertBox
//                 message={alert.message}
//                 type={alert.type}
//                 onClose={() => setAlert({ message: "", type: "success" })}
//             />

//             {/* Filter Card */}
//             <Card sx={{ mb: 4 }}>
//                 <CardContent>
//                     <form onSubmit={handleSearchSubmit}>
//                         <Grid container spacing={2} alignItems="center">
//                             <Grid item xs={12} md={5}>
//                                 <TextField
//                                     fullWidth
//                                     type="text"
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                     placeholder="Cari nama proyek atau nominal"
//                                     label="Pencarian"
//                                     variant="outlined"
//                                     size="medium"
//                                     InputProps={{
//                                         startAdornment: (
//                                             <InputAdornment position="start">
//                                                 <SearchIcon color="action" />
//                                             </InputAdornment>
//                                         ),
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6} md={3}>
//                                 <TextField
//                                     fullWidth
//                                     select
//                                     value={year}
//                                     onChange={(e) => setYear(e.target.value)}
//                                     label="Filter Tahun"
//                                     variant="outlined"
//                                     size="medium"
//                                     SelectProps={{
//                                         displayEmpty: true,
//                                     }}
//                                 >
//                                     <MenuItem value="">
//                                         <em>Semua tahun</em>
//                                     </MenuItem>
//                                     {yearOptions.map((yearOption) => (
//                                         <MenuItem key={yearOption} value={yearOption}>
//                                             {yearOption}
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={12} sm={6} md={4}>
//                                 <Box sx={{ display: 'flex', gap: 1 }}>
//                                     <Button
//                                         type="submit"
//                                         variant="contained"
//                                         color="primary"
//                                         fullWidth
//                                         startIcon={<SearchIcon />}
//                                         sx={{
//                                             py: 1.5,
//                                             fontWeight: 600,
//                                             textTransform: 'none',
//                                         }}
//                                     >
//                                         Cari
//                                     </Button>
//                                     <Button
//                                         type="button"
//                                         variant="outlined"
//                                         color="secondary"
//                                         onClick={handleReset}
//                                         startIcon={<RefreshIcon />}
//                                         sx={{
//                                             py: 1.5,
//                                             fontWeight: 600,
//                                             textTransform: 'none',
//                                         }}
//                                     >
//                                         Reset
//                                     </Button>
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                     </form>
//                 </CardContent>
//             </Card>

//             {/* Loading State */}
//             {loading && (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
//                     <CircularProgress />
//                     <Typography sx={{ ml: 2 }}>Memuat data...</Typography>
//                 </Box>
//             )}

//             {/* Table Card */}
//             {!loading && (
//                 <Card>
//                     <TableContainer>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell sx={{ fontWeight: 600 }}>No</TableCell>
//                                     <TableCell sx={{ fontWeight: 600 }}>Tanggal Proyek</TableCell>
//                                     <TableCell sx={{ fontWeight: 600 }}>Nama Proyek</TableCell>
//                                     <TableCell sx={{ fontWeight: 600 }} align="right">
//                                         Jumlah Pemasukan
//                                     </TableCell>
//                                     <TableCell sx={{ fontWeight: 600 }} align="center">
//                                         Aksi
//                                     </TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {paginatedItems.length > 0 ? (
//                                     paginatedItems.map((item, index) => (
//                                         <TableRow
//                                             key={item.id}
//                                             hover
//                                             sx={{
//                                                 '&:last-child td, &:last-child th': { border: 0 },
//                                             }}
//                                         >
//                                             <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                             <TableCell>{formatTanggalIndonesia(item.tanggal_proyek)}</TableCell>
//                                             <TableCell>{item.nama_proyek}</TableCell>
//                                             <TableCell align="right">
//                                                 {formatCurrency(Number(item.jumlah_pemasukan))}
//                                             </TableCell>
//                                             <TableCell align="center">
//                                                 <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
//                                                     <IconButton
//                                                         component={Link}
//                                                         to={`/income/edit/${item.id}`}
//                                                         color="warning"
//                                                         size="small"
//                                                         title="Edit"
//                                                     >
//                                                         <EditIcon fontSize="small" />
//                                                     </IconButton>
//                                                     <IconButton
//                                                         onClick={() => openDeleteDialog(item.id)}
//                                                         color="error"
//                                                         size="small"
//                                                         title="Hapus"
//                                                     >
//                                                         <DeleteIcon fontSize="small" />
//                                                     </IconButton>
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
//                                             <Typography color="text.secondary">
//                                                 {hasSearched ? "Data yang disortir tidak ditemukan" : "Belum ada data pemasukan"}
//                                             </Typography>
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     {/* Pagination */}
//                     <TablePagination
//                         component="div"
//                         count={items.length}
//                         page={page}
//                         onPageChange={handleChangePage}
//                         rowsPerPage={rowsPerPage}
//                         onRowsPerPageChange={handleChangeRowsPerPage}
//                         rowsPerPageOptions={[5, 10, 25, 50]}
//                         labelRowsPerPage="Baris per halaman:"
//                         labelDisplayedRowsArgs={{ page: page + 1 }}
//                         sx={{
//                             borderTop: '1px solid rgba(224, 224, 224, 1)',
//                             '& .MuiTablePagination-toolbar': {
//                                 minHeight: '64px',
//                             },
//                         }}
//                     />
//                 </Card>
//             )}

//             {/* Confirm Dialog */}
//             <ConfirmDialog
//                 open={dialogOpen}
//                 title="Hapus data pemasukan"
//                 message="Apakah anda yakin ingin menghapus data pemasukan ini?"
//                 confirmText="Ya, hapus"
//                 cancelText="Tidak"
//                 onConfirm={handleDelete}
//                 onCancel={closeDeleteDialog}
//                 loading={deleteLoading}
//             />
//         </Box>
//     );
// }

// export default IncomeListPage;

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
