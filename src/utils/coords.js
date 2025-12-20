export const parseCoords = (coordString) => {
    if (!coordString) return null;

    try {
        // Expected format: "46.54° N, 11.61° E"
        // Regex to capture number and direction
        const regex = /([\d.]+)°\s*([NS]),\s*([\d.]+)°\s*([EW])/;
        const match = coordString.match(regex);

        if (!match) return null;

        let lat = parseFloat(match[1]);
        if (match[2] === 'S') lat = -lat;

        let lng = parseFloat(match[3]);
        if (match[4] === 'W') lng = -lng;

        if (isNaN(lat) || isNaN(lng)) return null;

        return { lat, lng };
    } catch (e) {
        console.error("Error parsing coordinates:", e);
        return null;
    }
};
