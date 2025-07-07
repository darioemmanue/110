import React from "react";
import { Routes, Route } from "react-router-dom";
import Productos from "./pages/productos";
import CarritoLista from "./pages/carrito";
import Layout from "./pages/layout";
import Home from "./pages/home";
export default function App() {
	return (
		<Layout>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/productos" element={<Productos />} />
				<Route path="/carrito" element={<CarritoLista />} />
			</Routes>
		</Layout>
	);
}
