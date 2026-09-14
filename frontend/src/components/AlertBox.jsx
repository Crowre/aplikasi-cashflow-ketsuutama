import { useEffect, useState } from "react";
import {
    Alert,
    AlertTitle,
    Collapse,
    IconButton,
    Snackbar,
} from "@mui/material";
import AppIcon from "./AppIcon";

function AlertBox({
    message,
    type = "info",
    title,
    onClose,
    autoHide = true,
    autoHideDuration = 4000,
    floating = false,
}) {
    const [open, setOpen] = useState(Boolean(message));

    useEffect(() => {
        setOpen(Boolean(message));
    }, [message]);

    const handleClose = () => {
        setOpen(false);
        onClose?.();
    };

    if (!message) return null;

    const alertContent = (
        <Alert
            severity={type}
            variant="filled"
            className="app-alert"
            action={
                <IconButton
                    aria-label="Tutup notifikasi"
                    color="inherit"
                    size="small"
                    onClick={handleClose}
                >
                    <AppIcon name="close" fontSize="inherit" />
                </IconButton>
            }
        >
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
        </Alert>
    );

    if (floating) {
        return (
            <Snackbar
                open={open}
                autoHideDuration={autoHide ? autoHideDuration : null}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {alertContent}
            </Snackbar>
        );
    }

    return <Collapse in={open}>{alertContent}</Collapse>;
}

export default AlertBox;

