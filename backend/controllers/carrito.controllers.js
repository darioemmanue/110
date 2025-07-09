import pool from "../server/db.js";

export const agregarCarritoConItems = async (req, res) => {
	const { usuario_id, items } = req.body;

	if (!usuario_id) {
		return res.status(400).json({ error: "El usuario_id es requerido" });
	}
	if (!items || !Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ error: "Debe enviar al menos un item" });
	}

	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();

		const [carritoResult] = await conn.query(
			"INSERT INTO carrito (usuario_id, fecha) VALUES (?, NOW())",
			[usuario_id]
		);

		const carritoId = carritoResult.insertId;

		const itemsValues = items.map((item) => [
			carritoId,
			item.producto_id,
			item.cantidad,
			item.precio_unitario,
		]);

		await conn.query(
			"INSERT INTO carrito_items (carrito_id, producto_id, cantidad, precio_unitario) VALUES ?",
			[itemsValues]
		);

		await conn.commit();

		res.status(201).json({
			mensaje: "Carrito y items agregados",
			carrito_id: carritoId,
			items,
		});
	} catch (error) {
		await conn.rollback();
		console.error("Error al agregar carrito con items:", error);
		res.status(500).json({ error: "Error al agregar carrito con items" });
	} finally {
		conn.release();
	}
};
