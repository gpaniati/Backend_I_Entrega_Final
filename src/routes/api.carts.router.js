import { Router } from "express";
import CartsManager from "../managers/CartsManager.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

const errorHandler = (res, message) => {
    if (message === ERROR_INVALID_ID) return res.status(400).json({ status: false, message: ERROR_INVALID_ID });
    if (message === ERROR_NOT_FOUND_ID) return res.status(404).json({ status: false, message: ERROR_NOT_FOUND_ID });
    return res.status(500).json({ status: false, message });
};

const router = Router();
const cartsManager = new CartsManager();

// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/carts/:cid
// Listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
router.get("/:id", async (req, res) => {
    try {
        const cartFound = await cartsManager.getOneById(req.params.id);
        res.status(200).json({ status: true, payload: cartFound });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

// Endpoint: Método POST que escucha en la URL http://localhost:8080/api/carts/
// Crea un nuevo carrito vacio.
router.post("/", async (req, res) => {
    try {
        console.log("Entro a crear Carrito");
        const cart = await cartsManager.insertOne();
        res.status(201).json({ status: true, payload: cart });
    } catch (error) {
        errorHandler(res, error.message);
    }
});