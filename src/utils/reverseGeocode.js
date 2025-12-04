// services/reverseGeocode.js
import axios from 'axios'

export async function reverseGeocode(lat, lon) {
	// 1️⃣ geocode.xyz
	try {
		console.log('🔎 Tentando geocode.xyz...')
		const r1 = await axios.get('https://geocode.xyz', {
			params: { loc: `${lat},${lon}`, json: 1 },
			timeout: 7000,
		})

		if (!r1.data.error) {
			return {
				source: 'geocode.xyz',
				data: r1.data,
			}
		}
	} catch (err) {
		console.warn('⚠ geocode.xyz falhou')
	}

	// 2️⃣ OpenCage
	try {
		console.log('🔎 Tentando OpenCage...')
		const r2 = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
			params: {
				key: process.env.OPENCAGE_KEY,
				q: `${lat},${lon}`,
			},
			timeout: 7000,
		})

		return {
			source: 'opencage',
			data: r2.data,
		}
	} catch (err) {
		console.warn('⚠ OpenCage falhou')
	}

	// 3️⃣ Google Geocoding
	try {
		console.log('🔎 Tentando Google...')
		const r3 = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
			params: {
				latlng: `${lat},${lon}`,
				key: process.env.GOOGLE_MAPS_KEY,
			},
			timeout: 7000,
		})

		return {
			source: 'google',
			data: r3.data,
		}
	} catch (err) {
		console.warn('⚠ Google falhou')
	}

	// Nenhuma funcionou
	return null
}
