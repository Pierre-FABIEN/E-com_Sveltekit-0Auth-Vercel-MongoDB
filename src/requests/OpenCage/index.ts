import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const GEOCODING_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

export const getSuggestions = async (query: string) => {
	const url = `${GEOCODING_API_URL}?q=${encodeURIComponent(query)}&key=${process.env.OPENCAGEDATA_API_KEY}&language=fr&pretty=1&limit=5&countrycode=fr`;
	const response = await fetch(url);
	const data = await response.json();

	if (data.results) {
		return data.results.map((result) => {
			return {
				formatted: result.formatted,
				components: {
					house_number: result.components.house_number || '',
					road: result.components.road || '',
					city: result.components.city || result.components.town || result.components.village || '',
					state: result.components.state || '',
					postcode: result.components.postcode || '',
					country: result.components.country || ''
				}
			};
		});
	} else {
		throw new Error('No results found for the given query');
	}
};
