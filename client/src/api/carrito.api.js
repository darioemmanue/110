import axios from "axios";

const API = "http://localhost:3000/api/carrito";

export const agregarCarritoConItems = async (datos) => {
	const response = await axios.post(API, datos);
	return response.data;
};
