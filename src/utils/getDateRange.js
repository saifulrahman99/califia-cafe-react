export function getDateRange(month = null, year) {
    if (!year) throw new Error("Tahun wajib diisi");

    let start, end;

    if (month) {
        if (month < 1 || month > 12) throw new Error("Bulan harus antara 1 dan 12");
        start = new Date(year, month - 1, 1);
        end = new Date(year, month, 0); // Tanggal terakhir bulan tsb
    } else {
        start = new Date(year, 0, 1);    // 1 Januari
        end = new Date(year, 11, 31);    // 31 Desember
    }

    const format = (date) => date.toISOString().split("T")[0];

    return {
        start_date: format(start),
        end_date: format(end)
    };
}
