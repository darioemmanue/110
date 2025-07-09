import express from "express";
import cors from "cors";
import productosRoutes from "../routes/productos.routes.js";
import carritoRoutes from "../routes/carrito.routes.js";
import pedidoRoutes from "../routes/pedido.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/productos", productosRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
