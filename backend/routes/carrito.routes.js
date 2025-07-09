import { Router } from "express";
import { agregarCarritoConItems } from "../controllers/carrito.controllers.js";

const router = Router();

router.post("/", agregarCarritoConItems);

export default router;
