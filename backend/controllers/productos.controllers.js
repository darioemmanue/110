import pool from "../server/db.js";

export const getProductos = async (req, res) => {
	const { nombre = "" } = req.query;

	try {
		let query = "SELECT * FROM productos WHERE 1=1";
		const params = [];

		if (nombre) {
			query += " AND nombre LIKE ?";
			params.push(`%${nombre}%`);
		}

		const [result] = await pool.query(query, params);

		res.json(result);
	} catch (error) {
		console.error("Error al obtener productos:", error);
		res.status(500).json({ message: "Error al obtener productos" });
	}
};

export const getProducto = async (req, res) => {
	const { id } = req.params;

	try {
		const [result] = await pool.query("SELECT * FROM productos WHERE id = ?", [
			id,
		]);

		if (result.length === 0) {
			return res.status(404).json({ message: "Producto no encontrado" });
		}

		res.json(result[0]);
	} catch (error) {
		console.error("Error al obtener producto:", error);
		res.status(500).json({ message: "Error del servidor" });
	}
};
