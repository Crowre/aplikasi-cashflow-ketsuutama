import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

    const [alert, setAlert] = useState({
        message: "",
        type: "success",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password || !form.first_name || !form.last_name) {
            setAlert({
                message: "Parameter tidak boleh ada yang kosong",
                type: "error",
            });
            return;
        }

        if (form.password.length < 6) {
            setAlert({
                message: "Password tidak boleh kurang dari 6",
                type: "error",
            });
            return;
        }

        try {
            const res = await api.post("/auth/registration", form);

            navigate("/", {
                state: {
                    message: res.data.message || "Registrasi user berhasil, silakan login",
                    type: "success",
                },
            });
        } catch (error) {
            setAlert({
                message: error.response?.data?.message || "Registrasi gagal",
                type: "error",
            });
        }
    };

    return (
        <div className="page auth-page">
            <div className="card auth-card">
                <h2>Registrasi User</h2>

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
                        type="text"
                        name="first_name"
                        placeholder="Masukkan first name"
                        value={form.first_name}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Masukkan last name"
                        value={form.last_name}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Masukkan password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button type="submit">Registrasi</button>
                </form>

                <p className="auth-switch">
                    Sudah punya akun? <Link to="/">Login di sini</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;