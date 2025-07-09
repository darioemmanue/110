import pool from "../server/db.js";

export const confirmarPedidoSimple = async (req, res) => {
	const { carrito_id } = req.body;

	if (!carrito_id)
		return res.status(400).json({ error: "carrito_id es requerido" });

	try {
		const [result] = await pool.query(
			"UPDATE carrito SET estado = 'confirmado' WHERE id = ?",
			[carrito_id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Carrito no encontrado" });
		}

		res.json({ mensaje: "Carrito confirmado" });
	} catch (error) {
		console.error("Error al confirmar carrito:", error);
		res.status(500).json({ error: "Error al confirmar carrito" });
	}
};

export const confirmarPedidoDesdeCarrito = async (req, res) => {
	const { carrito_id } = req.body;

	if (!carrito_id) {
		return res.status(400).json({ error: "carrito_id es requerido" });
	}

	let conn;
	try {
		conn = await pool.getConnection();
		await conn.beginTransaction();

		const [carritoRows] = await conn.query(
			"SELECT * FROM carrito WHERE id = ?",
			[carrito_id]
		);
		if (carritoRows.length === 0) {
			throw new Error("Carrito no encontrado");
		}
		const carrito = carritoRows[0];
		const usuario_id = carrito.usuario_id;

		const [items] = await conn.query(
			"SELECT producto_id, cantidad, precio_unitario FROM carrito_items WHERE carrito_id = ?",
			[carrito_id]
		);
		if (items.length === 0) {
			throw new Error("El carrito no contiene productos");
		}

		const total = items.reduce((sum, item) => {
			const cantidad = Number(item.cantidad);
			const precio = Number(item.precio_unitario);

			if (isNaN(cantidad) || isNaN(precio)) {
				throw new Error("Datos inválidos en los items");
			}
			return sum + cantidad * precio;
		}, 0);

		const [pedidoResult] = await conn.query(
			"INSERT INTO pedidos (usuario_id, fecha, estado, total) VALUES (?, NOW(), 'pendiente', ?)",
			[usuario_id, total]
		);
		const pedido_id = pedidoResult.insertId;

		const pedidoItemsValues = items.map((item) => [
			pedido_id,
			item.producto_id,
			Number(item.cantidad),
			Number(item.precio_unitario),
		]);

		await conn.query(
			"INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?",
			[pedidoItemsValues]
		);

		await conn.query("UPDATE carrito SET estado = 'confirmado' WHERE id = ?", [
			carrito_id,
		]);

		await conn.commit();

		res.status(201).json({
			mensaje: "Pedido confirmado con éxito",
			pedido_id,
			total,
		});
	} catch (error) {
		if (conn) await conn.rollback();
		console.error("Error al confirmar el pedido:", error.message);
		res.status(500).json({
			error: "No se pudo confirmar el pedido",
			detalle: error.message,
		});
	} finally {
		if (conn) conn.release();
	}
};

export const getPedidosUsuario = async (req, res) => {
	try {
		const usuario_id = 1;

		const [pedidos] = await pool.query(
			"SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC",
			[usuario_id]
		);

		const result = [];
		for (const ped of pedidos) {
			const [items] = await pool.query(
				`
        SELECT pi.producto_id, pi.cantidad, pi.precio_unitario, p.nombre 
        FROM pedido_items pi
        JOIN productos p ON pi.producto_id = p.id
        WHERE pi.pedido_id = ?
      `,
				[ped.id]
			);
			result.push({ ...ped, items });
		}

		res.json(result);
	} catch (error) {
		console.error("Error al obtener pedidos:", error);
		res.status(500).json({ error: "Error al obtener pedidos" });
	}
};

export const agregarProducto = async (req, res) => {
	const { pedido_id } = req.params;
	const { producto_id, cantidad } = req.body;

	if (!producto_id || !cantidad)
		return res.status(400).json({ error: "Faltan datos" });

	let conn = await pool.getConnection();
	try {
		await conn.beginTransaction();

		const [product] = await conn.query(
			"SELECT precio FROM productos WHERE id = ?",
			[producto_id]
		);
		if (product.length === 0) throw new Error("Producto no existe");
		const precio = product[0].precio;

		await conn.query(
			`INSERT INTO pedido_items (pedido_id, producto_id, cantidad)
			 VALUES (?, ?, ?)`,
			[pedido_id, producto_id, cantidad]
		);

		await conn.query(`UPDATE pedidos SET total = total + ? WHERE id = ?`, [
			cantidad * precio,
			pedido_id,
		]);

		await conn.commit();
		res.json({ mensaje: "Producto agregado" });
	} catch (err) {
		await conn.rollback();
		console.error("❌ ERROR agregarProducto:", err.message);
		res.status(500).json({ error: err.message });
	} finally {
		conn.release();
	}
};

export const quitarProducto = async (req, res) => {
	const { pedido_id, producto_id } = req.params;
	let conn = await pool.getConnection();
	try {
		await conn.beginTransaction();
		const [item] = await conn.query(
			`
      SELECT cantidad, precio_unitario FROM pedido_items
      WHERE pedido_id = ? AND producto_id = ?
    `,
			[pedido_id, producto_id]
		);
		if (item.length === 0) throw new Error("Item no existe");

		await conn.query(
			`
      DELETE FROM pedido_items WHERE pedido_id = ? AND producto_id = ?
    `,
			[pedido_id, producto_id]
		);

		const totalRestar = item[0].cantidad * item[0].precio_unitario;
		await conn.query(
			`
      UPDATE pedidos SET total = total - ? WHERE id = ?
    `,
			[totalRestar, pedido_id]
		);

		await conn.commit();
		res.json({ mensaje: "Producto eliminado" });
	} catch (err) {
		await conn.rollback();
		console.error(err);
		res.status(500).json({ error: err.message });
	} finally {
		conn.release();
	}
};

export const modificarEstadoPedido = async (req, res) => {
	const { pedido_id } = req.params;
	const { estado } = req.body;

	console.log("🛠 Modificando pedido:", pedido_id, "nuevo estado:", estado);

	if (!estado) {
		return res.status(400).json({ error: "El estado es requerido" });
	}

	try {
		const [result] = await pool.query(
			"UPDATE pedidos SET estado = ? WHERE id = ?",
			[estado, pedido_id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Pedido no encontrado" });
		}

		res.json({ mensaje: "Estado actualizado correctamente" });
	} catch (error) {
		console.error("❌ Error en modificarEstadoPedido:", error.message);
		res.status(500).json({ error: "Error al actualizar el estado" });
	}
};

export const borrarPedido = async (req, res) => {
	const { pedido_id } = req.params;

	let conn;
	try {
		conn = await pool.getConnection();
		await conn.beginTransaction();

		await conn.query("DELETE FROM pedido_items WHERE pedido_id = ?", [
			pedido_id,
		]);

		const [result] = await conn.query("DELETE FROM pedidos WHERE id = ?", [
			pedido_id,
		]);

		if (result.affectedRows === 0) {
			await conn.rollback();
			return res.status(404).json({ error: "Pedido no encontrado" });
		}

		await conn.commit();
		res.json({ mensaje: "Pedido borrado correctamente" });
	} catch (error) {
		if (conn) await conn.rollback();
		console.error("Error al borrar pedido:", error);
		res.status(500).json({ error: "Error al borrar pedido" });
	} finally {
		if (conn) conn.release();
	}
};

export const modificarPedidoConProductos = async (req, res) => {
	const { pedido_id } = req.params;
	const { productos } = req.body;

	if (!pedido_id || !Array.isArray(productos)) {
		return res.status(400).json({ error: "Datos incompletos o incorrectos" });
	}

	let conn;
	try {
		conn = await pool.getConnection();
		await conn.beginTransaction();

		await conn.query("DELETE FROM pedido_items WHERE pedido_id = ?", [
			pedido_id,
		]);

		const nuevosItems = productos.map((p) => [
			pedido_id,
			p.producto_id,
			Number(p.cantidad),
			Number(p.precio_unitario),
		]);

		await conn.query(
			"INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?",
			[nuevosItems]
		);

		const nuevoTotal = productos.reduce(
			(acc, p) => acc + p.cantidad * p.precio_unitario,
			0
		);

		await conn.query("UPDATE pedidos SET total = ? WHERE id = ?", [
			nuevoTotal,
			pedido_id,
		]);

		await conn.commit();
		res.json({
			mensaje: "Pedido actualizado correctamente",
			total: nuevoTotal,
		});
	} catch (error) {
		if (conn) await conn.rollback();
		console.error("Error al modificar pedido:", error);
		res
			.status(500)
			.json({ error: "Error al modificar pedido", detalle: error.message });
	} finally {
		if (conn) conn.release();
	}
};
