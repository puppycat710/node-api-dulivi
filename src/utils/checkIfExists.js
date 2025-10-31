export default async function checkIfExists(itemsOrFn, field, value) {
	const items = typeof itemsOrFn === 'function' ? await itemsOrFn() : itemsOrFn

	if (!Array.isArray(items)) return false

	return items.some(
		(item) => String(item[field]).toLowerCase() === String(value).toLowerCase()
	)
}