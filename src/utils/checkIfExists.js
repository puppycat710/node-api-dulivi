// utils/checkIfExists.js
export default async function checkIfExists(getAllFn, field, value) {
	const items = await getAllFn()

	if (!Array.isArray(items)) return false

	return items.some(
		(item) => String(item[field]).toLowerCase() === String(value).toLowerCase()
	)
}
