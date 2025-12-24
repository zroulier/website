
/**
 * Safely extracts the Vimeo video ID from a given URL.
 * Handles standard URLs, player URLs, and URLs with query parameters.
 * 
 * @param {string} url - The Vimeo URL (e.g., "https://vimeo.com/123456")
 * @returns {string|null} - The numeric video ID or null if invalid
 */
export const getVimeoId = (url) => {
    if (!url || typeof url !== 'string') return null;

    // Check if it's a Vimeo URL
    if (!url.includes('vimeo')) return null;

    try {
        // Regex to find 8+ digit numbers (Vimeo IDs are typically 8-10 digits)
        // This avoids matching "vimeo" or "com" or small incidental numbers
        const idMatch = url.match(/(\d{8,})/);
        if (idMatch) {
            return idMatch[1];
        }

        // Fallback for shorter IDs or if embedded in path segments
        // Splits by slash and finds the last numeric segment
        const segments = url.split('/');
        for (let i = segments.length - 1; i >= 0; i--) {
            const segment = segments[i].split('?')[0]; // Remove query params
            if (/^\d+$/.test(segment)) {
                return segment;
            }
        }

        return null;
    } catch (e) {
        console.warn('Error extracting Vimeo ID:', e);
        return null;
    }
};
