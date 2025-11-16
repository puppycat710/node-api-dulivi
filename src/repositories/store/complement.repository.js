import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class ComplementRepository {
	// Criar produto
	async create(complementData) {
		const { title, description, price, combo_surcharge, image, fk_store_id } = complementData

		try {
			const result = await turso.execute(
				`INSERT INTO complements (title, description, price, combo_surcharge, image, fk_store_id)
         VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
				[
					title,
					description ?? null,
					price,
					combo_surcharge ?? 0,
					image ?? null,
					fk_store_id
				]
			)
			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Encontrar todos produtos
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM complements WHERE fk_store_id = ?`,
				[fk_store_id]
			)
			return result.rows.length ? result.rows : null
		} catch (error) {
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM complements WHERE id = ?`, [id])

			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			throw error
		}
	}
	// Atualizar produto
	async update(id, complementData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(complementData)
			const values = Object.values(complementData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE complements SET ${setClause} WHERE id = ?`
			// Adicionar o ID no final dos valores
			values.push(id)
			// Executar a query no Turso
			await turso.execute(query, values)
			// Retornar o usuário atualizado
			return this.getById(id)
		} catch (error) {
			throw error
		}
	}
	// Deletar produto
	async delete(id) {
		const result = await turso.execute(`DELETE FROM complements WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
	async getGroupsWithComplements(fk_store_id, fk_product_id) {
		try {
			const result = await turso.execute(`
				SELECT
					cg.id AS group_id,
					cg.title AS group_title,
					cg.option_limit,
					cg.option_minimum,
					cg.multiple_selection,
					cg.is_combo_group,
					cg.required,
	
					c.id AS complement_id,
					c.title AS complement_title,
					c.description AS complement_description,
					c.price AS complement_price,
					c.combo_surcharge,
					c.image AS complement_image
	
				FROM complement_groups cg
				INNER JOIN complement_group_products cgp
					ON cgp.fk_complement_group_id = cg.id
				INNER JOIN complement_group_complements cgc
					ON cgc.fk_complement_group_id = cg.id
				INNER JOIN complements c
					ON c.id = cgc.fk_complement_id
				
				WHERE 
					cg.fk_store_id = ?
					AND cgp.fk_product_id = ?
					AND cgp.fk_store_id = ?
					AND cgc.fk_store_id = ?
					AND c.fk_store_id = ?
	
				ORDER BY cg.id, c.id;
			`, [
				fk_store_id,
				fk_product_id,
				fk_store_id,
				fk_store_id,
				fk_store_id
			]);

			if (!result.rows.length) return [];

			// Transformar a consulta em objeto estruturado
			const groups = {};

			for (const row of result.rows) {
				if (!groups[row.group_id]) {
					groups[row.group_id] = {
						id: row.group_id,
						title: row.group_title,
						option_limit: row.option_limit,
						option_minimum: row.option_minimum,
						multiple_selection: row.multiple_selection,
						is_combo_group: row.is_combo_group,
						required: row.required,
						complements: []
					};
				}

				groups[row.group_id].complements.push({
					id: row.complement_id,
					title: row.complement_title,
					description: row.complement_description,
					price: row.complement_price,
					combo_surcharge: row.combo_surcharge,
					image: row.complement_image
				});
			}

			return Object.values(groups);
		} catch (error) {
			throw error;
		}
	}

}

export default new ComplementRepository()
