import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";

function Navbar() {
    const navigate = useNavigate();
    const loggedIn = isAuthenticated();

    const handleLogout = () => {
        logout();
        navigate("/", {
            state: { message: "Logout berhasil", type: "success" },
        });
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">Aplikasi Keuangan</div>

            <div className="nav-links">
                {!loggedIn ? (
                    <>
                        <Link to="/">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/income">Pemasukan</Link>
                        <Link to="/outcome">Pengeluaran</Link>
                        <button type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;