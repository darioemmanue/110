import express from "express";
import {
	confirmarPedidoDesdeCarrito,
	getPedidosUsuario,
	borrarPedido,
	modificarEstadoPedido,
	modificarPedidoConProductos,
	agregarProducto,
	quitarProducto,
} from "../controllers/pedido.controllers.js";

const router = express.Router();

router.post("/confirmar", confirmarPedidoDesdeCarrito);
router.get("/", getPedidosUsuario);
router.delete("/:pedido_id", borrarPedido);
router.patch("/:pedido_id/estado", modificarEstadoPedido);
router.put("/:pedido_id", modificarPedidoConProductos);
router.post("/:pedido_id/producto", agregarProducto); 
router.delete("/:pedido_id/producto/:producto_id", quitarProducto); 

export default router;
