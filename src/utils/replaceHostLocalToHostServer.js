export function replaceLocalhostWithServerHost(url) {
    if (url === null || url === undefined) return null;
    if (!url.includes("localhost")) return url; // If there's no "localhost", return the original URL

    const host = window.location.hostname; // Get the current host (IP or domain)
    return url.replace("localhost", host);
}
