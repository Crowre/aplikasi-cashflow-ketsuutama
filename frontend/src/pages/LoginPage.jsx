import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import AlertBox from "../components/AlertBox";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [alert, setAlert] = useState({
        message: "",
        type: "success",
    });

    useEffect(() => {
        if (location.state?.message) {
            setAlert({
                message: location.state.message,
                type: location.state.type || "success",
            });
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setAlert({
                message: "Username dan Password tidak boleh kosong",
                type: "error",
            });
            return;
        }

        try {
            const res = await api.post("/auth/login", form);
            localStorage.setItem("token", res.data.data.token);

            navigate("/income", {
                state: {
                    message: res.data.message || "Login berhasil",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Login gagal",
                type: "error",
            });
        }
    };

    return (
        <div className="page auth-page">
            <div className="card auth-card">
                <h2>Login User</h2>

                <AlertBox
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ message: "", type: "success" })}
                />

                <form onSubmit={handleSubmit} className="form-grid">
                    <input
                        type="text"
                        name="username"
                        placeholder="Masukkan username"
                        value={form.username}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Masukkan password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button type="submit">Login</button>
                </form>

                <p className="auth-switch">
                    Belum punya akun? <Link to="/register">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;