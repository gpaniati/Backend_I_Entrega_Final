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

// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/carts
// Listar todos los carritos de la base.
router.get("/", async (req, res) => {
    try {
        const cartsFound = await cartsManager.getAll();
        res.status(200).json({ status: true, payload: cartsFound });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

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
        const cart = await cartsManager.insertOne();
        res.status(201).json({ status: true, payload: cart });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

// POST api/carts/:cid/products/:pid
// Endpoint: Método PUT que escucha en la URL http://localhost:8080/api/carts/:cid/products/:pid
// Agrega un producto al carrito y si existe le suma 1 a la cantidad.
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cartUpdated = await cartsManager.updateOneByIds(cid, pid);
        res.status(200).json({ status: true, payload: cartUpdated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

//****  NUEVOS ENDPONTS*****

// PUT api/carts/:cid/products/:pid
// Endpoint: Método POST que escucha en la URL http://localhost:8080/api/carts/:cid/products/:pid
// Agrega un producto al carrito y si existe le suma 1 a la cantidad.
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cartUpdated = await cartsManager.updateOneByQuantity(cid, pid, quantity);
        res.status(200).json({ status: true, payload: cartUpdated });
    } catch (error) {
        errorHandler(res, error.message);
    }
});

// DELETE api/carts/:cid
// Endpoint: Método DELETE que escucha en la URL http://localhost:8080/api/carts/:cid
// Elimina todos los producto del carrito
router.delete('/:cid/', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartDeleted = await cartsManager.deleteProductsByCid (cid);
        res.status(200).json({ status: true, payload: cartDeleted});
    } catch (error) {
        errorHandler(res, error.message);
    }
});

export default router;