import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import AppIcon from "../components/AppIcon";
import api from "../services/api";
import AlertBox from "../components/AlertBox";
import { isAuthenticated } from "../utils/auth";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "success" });

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard", { replace: true });
            return;
        }

        if (location.state?.message) {
            setAlert({
                message: location.state.message,
                type: location.state.type || "success",
            });
            window.history.replaceState({}, document.title);
        }
    }, [location.state, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setAlert({ message: "Username dan password wajib diisi.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/auth/login", form);
            localStorage.setItem("token", res.data.data.token);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Login gagal",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="auth-page auth-page-login">
            <Card className="auth-card">
                <CardContent className="auth-card-content">
                    <Stack className="auth-heading">
                        <Avatar className="auth-logo">
                            <AppIcon name="wallet" />
                        </Avatar>
                        <Typography variant="h5" className="auth-title">
                            Selamat Datang Kembali
                        </Typography>
                        <Typography className="auth-subtitle">
                            Masuk untuk mengelola data keuangan Anda
                        </Typography>
                    </Stack>

                    <AlertBox
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert({ message: "", type: "success" })}
                    />

                    <Stack component="form" onSubmit={handleSubmit} className="auth-form">
                        <TextField
                            fullWidth
                            name="username"
                            label="Username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            slotProps={{ input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AppIcon name="user" />
                                    </InputAdornment>
                                ),
                            } }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            slotProps={{ input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AppIcon name="lock" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                        >
                                            {showPassword ? <AppIcon name="visibility_off" /> : <AppIcon name="visibility" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            } }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<AppIcon name="login" />}
                            disabled={loading}
                            className="auth-submit-button"
                        >
                            {loading ? "Memproses..." : "Login"}
                        </Button>
                    </Stack>

                    <Typography className="auth-switch-text">
                        Belum punya akun?{" "}
                        <Link to="/register" className="auth-link">
                            Daftar sekarang
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default LoginPage;
