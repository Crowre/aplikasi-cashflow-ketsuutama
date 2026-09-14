import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import AppIcon from "../components/AppIcon";
import { logout } from "../utils/auth";

const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Pemasukan", path: "/income", icon: "income" },
    { label: "Pengeluaran", path: "/outcome", icon: "outcome" },
];

function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:899px)");
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => {
        if (path === "/dashboard") return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/", {
            state: { message: "Logout berhasil", type: "success" },
        });
    };

    const drawerContent = (
        <Box className="sidebar-content">
            <Box className="sidebar-brand">
                <Avatar className="sidebar-logo">
                    <AppIcon name="wallet" fontSize="small" />
                </Avatar>
                <Box>
                    <Typography className="sidebar-title">Aplikasi Keuangan</Typography>
                    <Typography className="sidebar-subtitle">Financial Dashboard</Typography>
                </Box>
            </Box>

            <Divider />

            <List className="sidebar-menu">
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        selected={isActive(item.path)}
                        onClick={() => handleNavigate(item.path)}
                        className="sidebar-menu-item"
                    >
                        <ListItemIcon className="sidebar-menu-icon">
                            <AppIcon name={item.icon} />
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Box className="sidebar-footer">
                <ListItemButton onClick={handleLogout} className="sidebar-logout">
                    <ListItemIcon className="sidebar-logout-icon">
                        <AppIcon name="logout" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box className="app-shell">
            <AppBar position="fixed" color="inherit" elevation={0} className="app-topbar">
                <Toolbar className="app-toolbar">
                    {isMobile && (
                        <IconButton
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                            className="mobile-menu-button"
                            aria-label="Buka menu"
                        >
                            <AppIcon name="menu" />
                        </IconButton>
                    )}

                    <Box className="topbar-heading">
                        <Typography className="topbar-title">Dashboard Keuangan</Typography>
                        <Typography className="topbar-subtitle">
                            Kelola pemasukan dan pengeluaran dengan mudah
                        </Typography>
                    </Box>

                    <Tooltip title="Akun pengguna">
                        <Avatar className="topbar-avatar">U</Avatar>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Box component="nav" className="app-navigation">
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={isMobile ? mobileOpen : true}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    className="app-drawer"
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <main className="app-main">
                <Outlet />
            </main>
        </Box>
    );
}

export default AppLayout;
