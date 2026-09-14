export const buildCsv = (headers, rows) => {
    const escape = (value) => {
        let text = String(value ?? "");
        if (/^[\s]*[=+@-]/.test(text) && typeof value !== "number") text = "'" + text;
        return '"' + text.replaceAll('"', '""') + '"';
    };
    return "\uFEFF" + [headers, ...rows].map(row => row.map(escape).join(",")).join("\r\n");
};

export const downloadCsv = (filename, headers, rows) => {
    const url = URL.createObjectURL(new Blob([buildCsv(headers, rows)], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
