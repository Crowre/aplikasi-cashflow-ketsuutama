import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    LinearProgress,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import AppIcon from "../components/AppIcon";
import api from "../services/api";
import AlertBox from "../components/AlertBox";

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

function SummaryCard({ title, value, subtitle, icon, tone }) {
    return (
        <Card className={`summary-card summary-card-${tone}`}>
            <CardContent className="summary-card-content">
                <Box className="summary-card-copy">
                    <Typography className="summary-card-label">{title}</Typography>
                    <Typography className="summary-card-value">{value}</Typography>
                    <Typography className="summary-card-subtitle">{subtitle}</Typography>
                </Box>
                <Box className={`summary-card-icon summary-card-icon-${tone}`}>
                    {icon}
                </Box>
            </CardContent>
        </Card>
    );
}

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
        fetchDashboardData(String(currentYear));
    }, []);

    const metrics = useMemo(() => {
        const income = incomeItems.reduce(
            (sum, item) => sum + Number(item.jumlah_pemasukan || 0),
            0
        );
        const outcome = outcomeItems.reduce(
            (sum, item) => sum + Number(item.biaya_pengeluaran || 0),
            0
        );

        return {
            income,
            outcome,
            balance: income - outcome,
            count: incomeItems.length + outcomeItems.length,
            ratio: income > 0 ? (outcome / income) * 100 : 0,
        };
    }, [incomeItems, outcomeItems]);

    const monthlyData = useMemo(() => {
        const result = monthNames.map((month) => ({ month, income: 0, outcome: 0 }));

        incomeItems.forEach((item) => {
            const date = new Date(item.tanggal_proyek);
            if (!Number.isNaN(date.getTime())) {
                result[date.getMonth()].income += Number(item.jumlah_pemasukan || 0);
            }
        });

        outcomeItems.forEach((item) => {
            const date = new Date(item.tanggal_perjalanan);
            if (!Number.isNaN(date.getTime())) {
                result[date.getMonth()].outcome += Number(item.biaya_pengeluaran || 0);
            }
        });

        return result;
    }, [incomeItems, outcomeItems]);

    const classificationData = useMemo(() => {
        const grouped = {};

        outcomeItems.forEach((item) => {
            const key = item.klasifikasi_kode || "LAINNYA";
            grouped[key] = (grouped[key] || 0) + Number(item.biaya_pengeluaran || 0);
        });

        return Object.entries(grouped)
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [outcomeItems]);

    const latestTransactions = useMemo(() => {
        const income = incomeItems.map((item) => ({
            id: `income-${item.id}`,
            type: "Pemasukan",
            description: item.nama_proyek,
            amount: Number(item.jumlah_pemasukan || 0),
            date: item.tanggal_proyek,
        }));

        const outcome = outcomeItems.map((item) => ({
            id: `outcome-${item.id}`,
            type: "Pengeluaran",
            description: item.deskripsi,
            amount: Number(item.biaya_pengeluaran || 0),
            date: item.tanggal_perjalanan,
        }));

        return [...income, ...outcome]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6);
    }, [incomeItems, outcomeItems]);

    const maxMonthlyValue = Math.max(
        1,
        ...monthlyData.flatMap((item) => [item.income, item.outcome])
    );

    const maxClassificationValue = Math.max(
        1,
        ...classificationData.map((item) => item.total)
    );

    return (
        <Box className="page-container dashboard-page">
            <Box className="page-heading page-heading-dashboard">
                <Box>
                    <Typography variant="h4" className="page-title">Dashboard</Typography>
                    <Typography className="page-subtitle">
                        Ringkasan keuangan tahun {selectedYear}
                    </Typography>
                </Box>

                <Stack className="dashboard-toolbar">
                    <TextField
                        select
                        label="Tahun"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="year-select"
                    >
                        {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((year) => (
                            <MenuItem key={year} value={String(year)}>
                                {year}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button variant="outlined" onClick={() => fetchDashboardData(selectedYear)}>
                        Tampilkan
                    </Button>
                </Stack>
            </Box>

            <AlertBox
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ message: "", type: "success" })}
            />

            {loading ? (
                <Box className="loading-state">
                    <CircularProgress />
                    <Typography>Memuat dashboard...</Typography>
                </Box>
            ) : (
                <>
                    <Box className="summary-grid">
                        <SummaryCard
                            title="Total Pemasukan"
                            value={formatCurrency(metrics.income)}
                            subtitle={`${incomeItems.length} transaksi`}
                            icon={<AppIcon name="income" />}
                            tone="income"
                        />
                        <SummaryCard
                            title="Total Pengeluaran"
                            value={formatCurrency(metrics.outcome)}
                            subtitle={`${outcomeItems.length} transaksi`}
                            icon={<AppIcon name="outcome" />}
                            tone="outcome"
                        />
                        <SummaryCard
                            title="Saldo Bersih"
                            value={formatCurrency(metrics.balance)}
                            subtitle={metrics.balance >= 0 ? "Saldo positif" : "Perlu perhatian"}
                            icon={<AppIcon name="wallet" />}
                            tone="balance"
                        />
                        <SummaryCard
                            title="Total Transaksi"
                            value={metrics.count}
                            subtitle={`Rasio pengeluaran ${metrics.ratio.toFixed(1)}%`}
                            icon={<AppIcon name="ratio" />}
                            tone="transaction"
                        />
                    </Box>

                    <Box className="dashboard-analysis-grid">
                        <Card className="dashboard-panel trend-panel">
                            <CardContent className="dashboard-panel-content">
                                <Typography variant="h6" className="panel-title">
                                    Tren Arus Kas Bulanan
                                </Typography>
                                <Typography className="panel-subtitle">
                                    Perbandingan pemasukan dan pengeluaran per bulan
                                </Typography>

                                <Box className="trend-list">
                                    {monthlyData.map((item) => (
                                        <Box className="trend-row" key={item.month}>
                                            <Typography className="trend-month">{item.month}</Typography>
                                            <Box className="trend-bars">
                                                <Box className="trend-line">
                                                    <Typography className="trend-label trend-label-income">
                                                        Masuk
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(item.income / maxMonthlyValue) * 100}
                                                        className="trend-progress trend-progress-income"
                                                    />
                                                </Box>
                                                <Box className="trend-line">
                                                    <Typography className="trend-label trend-label-outcome">
                                                        Keluar
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(item.outcome / maxMonthlyValue) * 100}
                                                        className="trend-progress trend-progress-outcome"
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>

                        <Card className="dashboard-panel category-panel">
                            <CardContent className="dashboard-panel-content">
                                <Typography variant="h6" className="panel-title">
                                    Pengeluaran per Kategori
                                </Typography>
                                <Typography className="panel-subtitle">
                                    Lima kategori pengeluaran terbesar
                                </Typography>

                                <Box className="category-list">
                                    {classificationData.length > 0 ? (
                                        classificationData.map((item) => (
                                            <Box className="category-item" key={item.name}>
                                                <Box className="category-heading">
                                                    <Typography className="category-name">{item.name}</Typography>
                                                    <Typography className="category-value">
                                                        {formatCurrency(item.total)}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(item.total / maxClassificationValue) * 100}
                                                    className="category-progress"
                                                />
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography className="empty-message">
                                            Belum ada data pengeluaran.
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Card className="dashboard-panel recent-panel">
                        <CardContent className="recent-panel-heading">
                            <Typography variant="h6" className="panel-title">
                                Transaksi Terbaru
                            </Typography>
                            <Typography className="panel-subtitle">
                                Aktivitas keuangan terbaru pada tahun terpilih
                            </Typography>
                        </CardContent>
                        <Divider />
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tanggal</TableCell>
                                        <TableCell>Jenis</TableCell>
                                        <TableCell>Deskripsi</TableCell>
                                        <TableCell align="right">Nominal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {latestTransactions.length > 0 ? (
                                        latestTransactions.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>
                                                    {new Date(item.date).toLocaleDateString("id-ID")}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={item.type}
                                                        color={item.type === "Pemasukan" ? "success" : "error"}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>{item.description || "-"}</TableCell>
                                                <TableCell align="right" className="money-cell">
                                                    {formatCurrency(item.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" className="empty-table-cell">
                                                Belum ada transaksi.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </>
            )}
        </Box>
    );
}

export default DashboardPage;
