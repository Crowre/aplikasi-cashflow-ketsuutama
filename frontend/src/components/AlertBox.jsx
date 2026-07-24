import { useEffect } from "react";

function AlertBox({ message, type = "success", onClose }) {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose?.();
        }, 3000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`alert-box alert-${type}`}>
            <div className="alert-content">
                <strong>
                    {type === "success"
                        ? "Berhasil"
                        : type === "error"
                            ? "Gagal"
                            : "Informasi"}
                </strong>
                <p>{message}</p>
            </div>
            <button type="button" className="alert-close" onClick={onClose}>
                ×
            </button>
        </div>
    );
}

export default AlertBox;