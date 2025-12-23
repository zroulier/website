export const formatCoords = (coords) => {
    if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
        return null;
    }

    const { lat, lng } = coords;

    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';

    // Round to 2 decimal places for display
    const latDisplay = Math.abs(lat).toFixed(2);
    const lngDisplay = Math.abs(lng).toFixed(2);

    return `${latDisplay}° ${latDir}, ${lngDisplay}° ${lngDir}`;
};
