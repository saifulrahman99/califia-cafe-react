export function formatHour(rawDate) {
    const dateObj = new Date(rawDate.replace(" ", "T")); // Pastikan format ISO
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes} WIB`;
}