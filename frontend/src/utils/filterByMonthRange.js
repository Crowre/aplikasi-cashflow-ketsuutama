// Use the same local calendar date as the displayed transaction date.
export const filterByMonthRange = (items, dateField, startMonth, endMonth) => {
    if (!startMonth && !endMonth) return items;
    return items.filter((item) => {
        if (!item[dateField]) return false;
        const date = new Date(item[dateField]);
        if (Number.isNaN(date.getTime())) return false;
        const month = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
        return month >= startMonth && month <= endMonth;
    });
};
