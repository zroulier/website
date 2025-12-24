/**
 * Validates if the coordinates object contains valid numeric lat and lng.
 * @param {object} coords - { lat, lng }
 * @returns {boolean}
 */
export const isValidCoords = (coords) => {
    return (
        coords &&
        typeof coords === 'object' &&
        typeof coords.lat === 'number' &&
        Number.isFinite(coords.lat) &&
        typeof coords.lng === 'number' &&
        Number.isFinite(coords.lng)
    );
};

/**
 * Formats coordinates for display (e.g., "46.54° N, 11.61° E").
 * Returns null if coordinates are invalid.
 * @param {object} coords 
 * @returns {string|null}
 */
export const formatCoords = (coords) => {
    if (!isValidCoords(coords)) {
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
