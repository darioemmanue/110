import { useCarrito } from "../context/carritoContext";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useState } from "react";

export default function CarritoLista({ usuario_id = 1 }) {
	const {
		carrito,
		aumentarCantidad,
		disminuirCantidad,
		limpiarCarrito,
		total,
		cantidadTotal,
		guardarCarritoEnBD,
	} = useCarrito();

	const [guardando, setGuardando] = useState(false);
	const [mensaje, setMensaje] = useState("");

	const handleFinalizarCompra = async () => {
		try {
			setGuardando(true);
			setMensaje("");

			const respuesta = await guardarCarritoEnBD(usuario_id);

			setMensaje(
				`✅ Compra realizada. ID del carrito: ${respuesta.carrito_id}`
			);
		} catch (error) {
			setMensaje("❌ Error al procesar la compra.");
		} finally {
			setGuardando(false);
		}
	};

	if (carrito.length === 0)
		return (
			<div className="text-center text-gray-500 py-12">
				🛒 El carrito está vacío
			</div>
		);

	return (
		<div className="mt-40 p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto border border-gray-200">
			<h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
				Tu carrito ({cantidadTotal} {cantidadTotal === 1 ? "item" : "items"})
			</h2>

			<ul className="space-y-4 max-h-80 overflow-y-auto pr-1">
				{carrito.map((item) => (
					<li
						key={item.id}
						className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
						<div className="flex-1">
							<p className="text-sm font-medium text-gray-800">{item.nombre}</p>
							<p className="text-xs text-gray-500">
								${item.precio} c/u — x{item.cantidad}
							</p>
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={() => disminuirCantidad(item.id)}
								className="p-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
								<FiMinus size={14} />
							</button>
							<span className="text-sm font-semibold">{item.cantidad}</span>
							<button
								onClick={() => aumentarCantidad(item.id)}
								className="p-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
								<FiPlus size={14} />
							</button>
						</div>
					</li>
				))}
			</ul>

			<div className="mt-6 border-t pt-4 flex justify-between items-center text-base font-semibold text-gray-800">
				<span>Total:</span>
				<span className="text-emerald-600">${total.toFixed(2)}</span>
			</div>

			<button
				onClick={limpiarCarrito}
				className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2">
				<FiTrash2 size={16} /> Vaciar carrito
			</button>

			<button
				onClick={handleFinalizarCompra}
				disabled={guardando}
				className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-md text-sm font-medium transition-all">
				{guardando ? "Procesando compra..." : "Finalizar compra"}
			</button>

			{mensaje && (
				<p className="mt-3 text-sm text-center text-gray-700">{mensaje}</p>
			)}
		</div>
	);
}
