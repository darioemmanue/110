import React, { useEffect, useState } from "react";

const API_PEDIDOS = "http://localhost:3000/api/pedidos";
const API_PRODUCTOS = "http://localhost:3000/api/productos";

async function getPedidos() {
	const res = await fetch(API_PEDIDOS);
	if (!res.ok) throw new Error("Error al obtener pedidos");
	return await res.json();
}

async function getProductos() {
	const res = await fetch(API_PRODUCTOS);
	if (!res.ok) throw new Error("Error al obtener productos");
	return await res.json();
}

async function modificarEstadoPedido(pedido_id, nuevoEstado) {
	const res = await fetch(`${API_PEDIDOS}/${pedido_id}/estado`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ estado: nuevoEstado }),
	});
	if (!res.ok) throw new Error("Error al actualizar estado");
	return await res.json();
}

async function borrarPedido(pedido_id) {
	const res = await fetch(`${API_PEDIDOS}/${pedido_id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Error al borrar pedido");
}

async function agregarProducto(pedido_id, producto_id, cantidad) {
	const res = await fetch(`${API_PEDIDOS}/${pedido_id}/producto`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ producto_id, cantidad }),
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error || "Error al agregar producto");
	}
	return await res.json();
}

async function quitarProducto(pedido_id, producto_id) {
	const res = await fetch(
		`${API_PEDIDOS}/${pedido_id}/producto/${producto_id}`,
		{ method: "DELETE" }
	);
	if (!res.ok) throw new Error("Error al quitar producto");
	return await res.json();
}

export default function PedidosUsuario() {
	const [pedidos, setPedidos] = useState([]);
	const [productos, setProductos] = useState([]);
	const [estadosEditados, setEstadosEditados] = useState({});
	const [agregarProductoData, setAgregarProductoData] = useState({});
	const [mensaje, setMensaje] = useState("");
	const [error, setError] = useState("");
	const [cargando, setCargando] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setCargando(true);
				const [peds, prods] = await Promise.all([getPedidos(), getProductos()]);
				setPedidos(peds);
				setProductos(prods);
			} catch (e) {
				setError(e.message);
			} finally {
				setCargando(false);
			}
		};
		fetchData();
	}, []);

	const handleEstadoChange = (id, estado) =>
		setEstadosEditados((prev) => ({ ...prev, [id]: estado }));

	const guardarEstado = async (id) => {
		const nuevoEstado = estadosEditados[id];
		if (!nuevoEstado) return;
		try {
			await modificarEstadoPedido(id, nuevoEstado);
			setMensaje(`Estado actualizado a "${nuevoEstado}"`);
			setEstadosEditados((prev) => ({ ...prev, [id]: undefined }));
			setPedidos(await getPedidos());
		} catch (e) {
			setError(e.message);
		}
	};

	const handleAgregarProducto = async (id) => {
		const { producto_id, cantidad } = agregarProductoData[id] || {};
		if (!producto_id || !cantidad || cantidad <= 0) {
			setError("Completa producto y cantidad válidos");
			return;
		}
		try {
			await agregarProducto(id, Number(producto_id), Number(cantidad));
			setMensaje("Producto agregado");
			setAgregarProductoData((prev) => ({
				...prev,
				[id]: { producto_id: "", cantidad: 1 },
			}));
			setPedidos(await getPedidos());
		} catch (e) {
			setError(e.message);
		}
	};

	const handleQuitarProducto = async (pedido_id, producto_id) => {
		if (!window.confirm("¿Quitar este producto del pedido?")) return;
		await quitarProducto(pedido_id, producto_id);
		setPedidos(await getPedidos());
	};

	const handleBorrar = async (id) => {
		if (!window.confirm("¿Eliminar el pedido completo?")) return;
		await borrarPedido(id);
		setPedidos(await getPedidos());
	};

	return (
		<div className="max-w-6xl mx-auto p-4 text-gray-800">
			<h1 className="text-2xl font-bold text-center mb-6">Mis Pedidos</h1>

			{cargando && <p className="text-center text-blue-600">Cargando...</p>}
			{mensaje && <p className="text-center text-green-600">{mensaje}</p>}
			{error && <p className="text-center text-red-600">{error}</p>}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{pedidos.map((pedido) => (
					<div
						key={pedido.id}
						className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between ">
						<div>
							<h2 className="text-lg font-bold mb-1">Pedido #{pedido.id}</h2>
							<p className="text-sm text-gray-500 mb-1">
								Fecha:{" "}
								{new Date(pedido.fecha).toLocaleString(undefined, {
									dateStyle: "medium",
									timeStyle: "short",
								})}
							</p>
							<p className="font-semibold mb-2">
								Total: ${Number(pedido.total).toFixed(2)}
							</p>

							<label className="block font-semibold mb-1">Estado:</label>
							<select
								value={estadosEditados[pedido.id] ?? pedido.estado}
								onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
								className="w-full mb-2 p-2 border rounded">
								<option value="pendiente">Pendiente</option>
								<option value="confirmado">Confirmado</option>
							</select>
							<button
								onClick={() => guardarEstado(pedido.id)}
								className="w-full bg-blue-600 text-white py-2 rounded mb-3 hover:bg-blue-700 transition">
								Guardar estado
							</button>

							<h3 className="font-semibold mb-1">Productos:</h3>
							<ul className="text-sm max-h-40 overflow-y-auto space-y-1">
								{pedido.items?.length > 0 ? (
									pedido.items.map((item) => (
										<li
											key={item.producto_id}
											className="flex justify-between items-center border-b pb-1">
											<span>
												{item.nombre} x{item.cantidad} (${item.precio_unitario})
											</span>
											<button
												onClick={() =>
													handleQuitarProducto(pedido.id, item.producto_id)
												}
												className="text-red-500 font-bold hover:text-red-700">
												×
											</button>
										</li>
									))
								) : (
									<li className="text-gray-400 italic">
										Sin productos en el pedido
									</li>
								)}
							</ul>
						</div>

						<div className="mt-4">
							<div className="flex items-center gap-2 mb-2 ">
								<select
									value={agregarProductoData[pedido.id]?.producto_id || ""}
									onChange={(e) =>
										setAgregarProductoData((prev) => ({
											...prev,
											[pedido.id]: {
												...prev[pedido.id],
												producto_id: e.target.value,
											},
										}))
									}
									className="flex-1 p-2 border rounded">
									<option value="">Producto</option>
									{productos.map((p) => (
										<option key={p.id} value={p.id}>
											{p.nombre} - ${p.precio_unitario}
										</option>
									))}
								</select>
								<input
									type="number"
									min="1"
									value={agregarProductoData[pedido.id]?.cantidad || 0}
									onChange={(e) =>
										setAgregarProductoData((prev) => ({
											...prev,
											[pedido.id]: {
												...prev[pedido.id],
												cantidad: Number(e.target.value),
											},
										}))
									}
									className="w-15 p-2 border rounded"
								/>
							</div>
							<center>
								<button
									onClick={() => handleAgregarProducto(pedido.id)}
									className="bg-gradient-to-r from-blue-400 to-blue-800 justify-center items-center text-white px-4 py-2 rounded hover:bg-green-700 transition mb-5">
									Agregar
								</button>
							</center>
							<button
								onClick={() => handleBorrar(pedido.id)}
								className="w-full bg-red-300 text-white py-2 rounded hover:bg-red-700 transition">
								Eliminar Pedido
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
