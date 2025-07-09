import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ProductosProvider } from "./context/productoContext.jsx";
import { CarritoProvider } from "./context/carritoContext.jsx";
import { PedidoProvider } from "./context/pedidoContext";
import "./styles/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<ProductosProvider>
				<CarritoProvider>
					<PedidoProvider>
						<App />
					</PedidoProvider>
				</CarritoProvider>
			</ProductosProvider>
		</BrowserRouter>
	</StrictMode>
);
