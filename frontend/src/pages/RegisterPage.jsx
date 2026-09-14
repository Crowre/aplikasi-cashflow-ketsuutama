import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: "", type: "success" });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password || !form.first_name || !form.last_name) {
            setAlert({ message: "Semua field wajib diisi.", type: "error" });
            return;
        }

        if (form.password.length < 6) {
            setAlert({ message: "Password minimal 6 karakter.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/auth/registration", form);
            navigate("/", {
                state: {
                    message: res.data.message || "Registrasi berhasil, silakan login",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Registrasi gagal",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="auth-page auth-page-register">
            <Card className="auth-card register-card">
                <CardContent className="auth-card-content">
                    <Stack className="auth-heading">
                        <Avatar className="auth-logo">
                            <AppIcon name="wallet" />
                        </Avatar>
                        <Typography variant="h5" className="auth-title">
                            Buat Akun Baru
                        </Typography>
                        <Typography className="auth-subtitle">
                            Lengkapi data berikut untuk mulai menggunakan aplikasi
                        </Typography>
                    </Stack>

                    <AlertBox
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert({ message: "", type: "success" })}
                    />

                    <Stack component="form" onSubmit={handleSubmit} className="auth-form">
                        <Box className="form-two-columns">
                            <TextField
                                fullWidth
                                name="first_name"
                                label="Nama Depan"
                                value={form.first_name}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                name="last_name"
                                label="Nama Belakang"
                                value={form.last_name}
                                onChange={handleChange}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            name="username"
                            label="Username"
                            value={form.username}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            helperText="Minimal 6 karakter"
                            InputProps={{
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
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<AppIcon name="person_add" />}
                            disabled={loading}
                            className="auth-submit-button"
                        >
                            {loading ? "Memproses..." : "Daftar"}
                        </Button>
                    </Stack>

                    <Typography className="auth-switch-text">
                        Sudah punya akun?{" "}
                        <Link to="/" className="auth-link">
                            Login di sini
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default RegisterPage;
