
/**
 * Searches for a postal code using OpenStreetMap's Nominatim API.
 * 
 * @param city The city name (e.g., "Salerno")
 * @param address The street address (e.g., "Via Gelso 1")
 * @returns The postal code if found, or null if not found or error.
 */
export async function searchPostalCode(city: string, address: string): Promise<string | null> {
    if (!city || !address) return null;

    try {
        // Nominatim requires a user-agent
        const query = new URLSearchParams({
            city: city,
            street: address,
            country: 'Italy',
            format: 'json',
            addressdetails: '1',
            limit: '1'
        });

        const response = await fetch(`https://nominatim.openstreetmap.org/search?${query.toString()}`, {
            headers: {
                'User-Agent': 'GymConnectAI/1.0',
                'Accept-Language': 'it-IT' // Prefer Italian results
            }
        });

        if (!response.ok) {
            console.warn('Geocoding fetch failed:', response.statusText);
            return null;
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            // Access nested address object
            const result = data[0];
            if (result.address && result.address.postcode) {
                return result.address.postcode;
            }
        }

        return null;
    } catch (error) {
        console.error('Error searching postal code:', error);
        return null;
    }
}
