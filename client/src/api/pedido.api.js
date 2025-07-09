import axios from "axios";

const API = "http://localhost:3000/api/pedidos";

export const confirmarPedido = async ({ carrito_id, estado = "pendiente" }) => {
	const response = await axios.post(`${API}/confirmar`, { carrito_id, estado });
	return response.data;
};

export const getPedidosPorUsuario = async (usuario_id) => {
	const response = await axios.get(`${API}/usuario/${usuario_id}`);
	return response.data;
};
