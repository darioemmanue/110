import { createContext, useContext, useEffect, useState } from "react";
import { getProductosRequest, getProductoRequest } from "../api/productos.api";

const ProductosContext = createContext();

export function ProductosProvider({ children }) {
	const [productos, setProductos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const cargarProductos = async () => {
		setLoading(true);
		const res = await getProductosRequest();
		if (res.error) {
			setError(res.error);
		} else {
			setProductos(res.data);
		}
		setLoading(false);
	};

	const obtenerProductoPorId = async (id) => {
		const res = await getProductoRequest(id);
		if (res.error) {
			console.error("Error al buscar producto:", res.error.message);
			return null;
		}
		return res.data;
	};

	useEffect(() => {
		cargarProductos();
	}, []);

	return (
		<ProductosContext.Provider
			value={{
				productos,
				loading,
				error,
				cargarProductos,
				obtenerProductoPorId,
			}}>
			{children}
		</ProductosContext.Provider>
	);
}

export const useProductos = () => {
	const context = useContext(ProductosContext);
	if (!context) throw new Error("Error con el <ProductosProvider>");
	return context;
};
