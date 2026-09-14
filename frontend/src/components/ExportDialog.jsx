import { useState } from "react";
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import api from "../services/api";
import { downloadCsv } from "../utils/exportCsv";
import { formatTanggalIndonesia } from "../utils/formatDate";

export default function ExportDialog({ kind, items, onClose }) {
    const [scope, setScope] = useState("filtered");
    const [selected, setSelected] = useState([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const income = kind === "income";
    const label = income ? "pemasukan" : "pengeluaran";
    const dateField = income ? "tanggal_proyek" : "tanggal_perjalanan";
    const amountField = income ? "jumlah_pemasukan" : "biaya_pengeluaran";
    const exportData = async () => {
        setBusy(true);
        setError("");
        try {
            let rows = items;
            if (scope === "all") {
                const response = await api.get('/' + kind);
                if (!Array.isArray(response.data.data)) throw new Error("Respons data tidak valid.");
                rows = response.data.data;
            } else if (scope === "selected") rows = items.filter(item => selected.includes(item.id));
            if (!rows.length) throw new Error("Tidak ada data untuk diekspor.");
            const headers = income ? ["Tanggal", "Nama Proyek", "Jumlah Pemasukan"] : ["Tanggal", "Klasifikasi", "Deskripsi", "Lokasi", "Biaya Pengeluaran"];
            const values = rows.map(item => income
                ? [formatTanggalIndonesia(item[dateField]), item.nama_proyek, Number(item[amountField])]
                : [formatTanggalIndonesia(item[dateField]), item.klasifikasi_kode, item.deskripsi, item.lokasi, Number(item[amountField])]);
            const totalRow = Array(headers.length).fill("");
            totalRow[0] = "TOTAL";
            totalRow[headers.length - 1] = rows.reduce((sum, item) => sum + Number(item[amountField] || 0), 0);
            downloadCsv(label + '-' + scope + '.csv', headers, [...values, totalRow]);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Gagal mengekspor data.");
        } finally { setBusy(false); }
    };
    return <Dialog open onClose={busy ? undefined : onClose} fullWidth maxWidth="sm" aria-labelledby="export-title">
        <DialogTitle id="export-title">Ekspor {label}</DialogTitle>
        <DialogContent>
            <Typography variant="body2" color="text.secondary">Unduh CSV yang dapat dibuka di Excel. Hasil filter mengikuti data tabel setelah tombol Cari ditekan, termasuk semua halaman.</Typography>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <RadioGroup value={scope} onChange={e => setScope(e.target.value)} aria-label="Data yang diekspor">
                <FormControlLabel disabled={busy} value="all" control={<Radio />} label="Semua data (tanpa filter)" />
                <FormControlLabel disabled={busy || !items.length} value="filtered" control={<Radio />} label={'Hasil filter di tabel (' + items.length + ' transaksi)'} />
                <FormControlLabel disabled={busy || !items.length} value="selected" control={<Radio />} label="Pilih beberapa transaksi dari hasil filter" />
            </RadioGroup>
            {scope === "selected" && <Stack sx={{ maxHeight: 280, overflow: "auto" }}>
                <FormControlLabel control={<Checkbox disabled={busy} checked={items.length > 0 && selected.length === items.length} indeterminate={selected.length > 0 && selected.length < items.length} onChange={e => setSelected(e.target.checked ? items.map(item => item.id) : [])} />} label="Pilih semua hasil filter" />
                {items.map(item => <FormControlLabel key={item.id} control={<Checkbox disabled={busy} checked={selected.includes(item.id)} onChange={e => setSelected(previous => e.target.checked ? [...previous, item.id] : previous.filter(id => id !== item.id))} />} label={formatTanggalIndonesia(item[dateField]) + ' ? ' + (income ? item.nama_proyek : item.deskripsi) + ' ? Rp ' + Number(item[amountField]).toLocaleString('id-ID')} />)}
            </Stack>}
        </DialogContent>
        <DialogActions>
            <Button disabled={busy} onClick={onClose}>Batal</Button>
            <Button variant="contained" disabled={busy || (scope === "selected" ? !selected.length : scope === "filtered" && !items.length)} onClick={exportData}>{busy ? "Mengekspor..." : "Unduh CSV"}</Button>
        </DialogActions>
    </Dialog>;
}
