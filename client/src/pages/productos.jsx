import { useEffect, useState } from "react";
import { getProductosRequest } from "../api/productos.api"; // Asegúrate de que este path sea correcto
import { HiShoppingCart } from "react-icons/hi"; // Asegúrate de instalar react-icons si no lo has hecho
import CardProductos from "../components/cardProducto";

import { Link } from "react-router-dom";

export default function Productos() {
	const [productos, setProductos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProductos = async () => {
			const res = await getProductosRequest();
			console.log("Productos recibidos:", res.data);
			setProductos(res.data);
			setLoading(false);
		};

		fetchProductos();
	}, []);

	return (
		<>
			<div className="relative min-h-screen px-4 py-10">
				{/* Encabezado con título y carrito */}
				<div className="flex items-center relative">
					<h1 className="text-4xl font-bold ms-30 mt-10 w-full">
						<span className="bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent">
							<></>Nuestros Productos!!
						</span>
					</h1>
				</div>

				{/* Cargando */}
				{loading ? (
					<p className="text-center mt-10">Cargando productos...</p>
				) : (
					// Grid de productos
					<div className="mt-10 flex flex-wrap justify-center gap-6">
						{productos.length > 0 ? (
							productos.map((producto) => (
								<CardProductos key={producto.id} producto={producto} />
							))
						) : (
							<p className="text-center text-gray-500">
								No hay productos disponibles.
							</p>
						)}
					</div>
				)}
			</div>
			<a
				href="/carrito"
				className="
					fixed bottom-4 right-4
					bg-gradient-to-r from-blue-400 to-blue-800
					text-white p-3 rounded-full shadow-lg
					flex items-center space-x-2
					z-50
					cursor-pointer
					select-none
					no-underline

					transform transition-transform duration-300
					hover:scale-110
				"
				aria-label="Ir al carrito">
				<HiShoppingCart size={24} />
				<span className="font-semibold">Carrito</span>
			</a>
		</>
	);
}
