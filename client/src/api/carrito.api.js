import axios from "axios";

const API = "http://localhost:3000/api/carrito";

export const agregarCarritoConItems = async (datos) => {
	try {
		const response = await axios.post(`${API}/carrito`, datos);
		return response.data;
	} catch (error) {
		console.error("Error al agregar carrito:", error);
		throw (
			error.response?.data || {
				error: "Error desconocido al agregar el carrito",
			}
		);
	}
};
