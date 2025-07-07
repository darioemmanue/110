import express from "express";
import { agregarCarritoConItems } from "../controllers/carrito.controllers.js";

const router = express.Router();

router.post("/carrito", agregarCarritoConItems);

export default router;
