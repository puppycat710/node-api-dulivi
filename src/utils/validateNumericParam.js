export const validateNumericParam = (paramName) => {
	return (req, res, next) => {
		const value = Number(req.params[paramName] ?? req.query[paramName])

		if (!Number.isInteger(value) || value <= 0) {
			return res.status(400).json({
				success: false,
				error: `${paramName} inválido`,
			})
		}

		// passa o valor convertido pro controller
		if (req.params[paramName]) req.params[paramName] = value
		if (req.query[paramName]) req.query[paramName] = value

		next()
	}
}
