import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

function ConfirmDialog({
    open,
    title = "Konfirmasi",
    message = "Apakah Anda yakin ingin melanjutkan aksi ini?",
    confirmText = "Hapus",
    cancelText = "Batal",
    onConfirm,
    onCancel,
    loading = false,
}) {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
            fullWidth
            maxWidth="xs"
            className="confirm-dialog"
        >
            <DialogTitle className="confirm-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions className="confirm-dialog-actions">
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                    {cancelText}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? "Memproses..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
