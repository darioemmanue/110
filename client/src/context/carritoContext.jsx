import { createContext, useContext, useEffect, useState } from "react";
import { agregarCarritoConItems } from "../api/carrito.api";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
	const [carrito, setCarrito] = useState(() => {
		const stored = localStorage.getItem("carrito");
		return stored ? JSON.parse(stored) : [];
	});

	useEffect(() => {
		localStorage.setItem("carrito", JSON.stringify(carrito));
	}, [carrito]);

	const agregarAlCarrito = (producto) => {
		setCarrito((prev) => {
			const existente = prev.find((p) => p.id === producto.id);
			if (existente) {
				return prev.map((p) =>
					p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
				);
			}
			return [...prev, { ...producto, cantidad: 1 }];
		});
	};

	const aumentarCantidad = (id) => {
		setCarrito((prev) =>
			prev.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p))
		);
	};

	const disminuirCantidad = (id) => {
		setCarrito((prev) =>
			prev
				.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
				.filter((p) => p.cantidad > 0)
		);
	};

	const limpiarCarrito = () => setCarrito([]);

	const total = carrito.reduce(
		(acc, item) => acc + item.precio * item.cantidad,
		0
	);
	const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

	const guardarCarritoEnBD = async (usuario_id) => {
		try {
			const items = carrito.map((item) => ({
				producto_id: item.id,
				cantidad: item.cantidad,
				precio_unitario: item.precio,
			}));

			const datos = { usuario_id, items };

			const respuesta = await agregarCarritoConItems(datos);
			console.log("Carrito guardado en BD:", respuesta);

			limpiarCarrito();

			return respuesta;
		} catch (error) {
			console.error("Error al guardar carrito en BD:", error);
			throw error;
		}
	};

	return (
		<CarritoContext.Provider
			value={{
				carrito,
				agregarAlCarrito,
				aumentarCantidad,
				disminuirCantidad,
				limpiarCarrito,
				total,
				cantidadTotal,
				guardarCarritoEnBD,
			}}>
			{children}
		</CarritoContext.Provider>
	);
}

export const useCarrito = () => {
	const context = useContext(CarritoContext);
	if (!context) throw new Error("Error con el <CarritoProvider>");
	return context;
};
