import React from "react";
import { FaShopify } from "react-icons/fa";

export default function Home() {
	return (
		<section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 px-4">
			<div className="flex items-center justify-center gap-3 mb-6">
				<FaShopify className="text-6xl  bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text" />
				<h1 className="text-5xl font-extrabold text-center text-transparent bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text">
					Bienvenido a la tienda
				</h1>
			</div>
			<p className="text-lg text-center max-w-xl mb-4">
				Explora nuestros productos y disfruta de grandes ofertas.
			</p>

			<h3 className="text-xl font-semibold text-blue-700 hover:text-blue-900 transition">
				<a href="/productos">¡Haz tu pedido aquí!</a>
			</h3>
		</section>
	);
}
