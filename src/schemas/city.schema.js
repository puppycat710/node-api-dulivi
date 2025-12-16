import { z } from 'zod'

export const cityCreateSchema = z.object({
	id: z.number().int().positive().optional(),
	name: z.string().min(2, 'Nome muito curto').max(100, 'Nome muito longo'),
	fk_store_id: z.number().int().positive(),
})

export const idParamSchema = z.object({
	id: z.preprocess((val) => Number(val), z.number().int().positive()),
})

export const fkStoreIdSchema = z.object({
	fk_store_id: z.preprocess((val) => Number(val), z.number().int().positive()),
})

export const cityUpdateSchema = z
	.object({
		id: z.number().int().positive().optional(),
		name: z.string().min(2).max(100).optional(),
		fk_store_id: z.number().int().positive().optional(),
	})
	.strict() // 🚨 impede campos extras
	.refine((data) => Object.keys(data).length > 0, { message: 'Envie ao menos um campo para atualizar' })
