import { createContext, useContext, useState } from "react";
import { confirmarPedido, getPedidosPorUsuario } from "../api/pedido.api";

const PedidoContext = createContext();

export const usePedidos = () => useContext(PedidoContext);

export const PedidoProvider = ({ children }) => {
	const [pedidos, setPedidos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const crearPedido = async (carrito_id, usuario_id) => {
		try {
			setLoading(true);
			setError(null);

			const res = await confirmarPedido({ carrito_id });
			console.log("Pedido confirmado:", res);

			// Obtener pedidos actualizados del usuario
			await obtenerPedidos(usuario_id);
		} catch (err) {
			console.error("Error al crear pedido:", err);
			setError(err.response?.data?.error || "Error al crear pedido");
		} finally {
			setLoading(false);
		}
	};

	const obtenerPedidos = async (usuario_id) => {
		try {
			setLoading(true);
			const res = await getPedidosPorUsuario(usuario_id);
			setPedidos(res.pedidos);
		} catch (err) {
			console.error("Error al obtener pedidos:", err);
			setError("No se pudieron obtener los pedidos");
		} finally {
			setLoading(false);
		}
	};

	return (
		<PedidoContext.Provider
			value={{
				pedidos,
				loading,
				error,
				crearPedido,
				obtenerPedidos,
			}}>
			{children}
		</PedidoContext.Provider>
	);
};
