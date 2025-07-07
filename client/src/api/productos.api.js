import axios from "axios";

const API = "http://localhost:3000/api/productos";

export const getProductosRequest = async () => {
	try {
		const response = await axios.get(API);
		console.log("Productos obtenidos:", response.data);
		return { data: response.data };
	} catch (error) {
		console.error("Error al obtener productos:", error.message);
		return { data: [], error };
	}
};

export const getProductoRequest = async (id) => {
	try {
		const response = await axios.get(`${API}/${id}`);
		return { data: response.data };
	} catch (error) {
		console.error(`Error al obtener producto con ID ${id}:`, error.message);
		return { data: null, error };
	}
};
