function ConfirmDialog({
    open,
    title = "Konfirmasi",
    message = "Apakah anda yakin ingin melanjutkan aksi ini?",
    confirmText = "Hapus",
    cancelText = "Batal",
    onConfirm,
    onCancel,
    loading = false,
}) {
    if (!open) return null;

    return (
        <div className="dialog-backdrop" onClick={onCancel}>
            <div
                className="dialog-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
            >
                <h3 id="confirm-dialog-title">{title}</h3>
                <p>{message}</p>

                <div className="dialog-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="btn-danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;