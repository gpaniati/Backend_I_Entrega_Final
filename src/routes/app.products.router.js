import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js"
import CartsManager from "../managers/CartsManager.js"
import { ERROR_SERVER } from "../constants/messages.constant.js";

const router = Router();

const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

// Endpoint: Método GET que escucha en la URL http://localhost:8080/products
// Listar todos los productos de la base usando solo handlebars filtrado por los parametros q lleguen.
router.get("/products", async (req, res) => {
    try{
        const products = await productsManager.getAll(req.query);
        res.status(200).render("index", { title: "ModoFit Market", products });
    }catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

// Endpoint: Método GET que escucha en la URL http://localhost:8080/products/:pid
// Lista el detalle de un producto en particular.
router.get("/products/:pid", async (req, res) => {
    try{
        const productSelected= await productsManager.getOneById(req.params.pid);
        const cartsFound= await cartsManager.getAll();

        //Datos para pasar a la vista productos.
        const data = {
            product : productSelected,
            carts: cartsFound
        }

        res.status(200).render("product", { title: "ModoFit Market / Detalle", data });
    }catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

// Endpoint: Método GET que escucha en la URL http://localhost:8080/realtimeproducts
// Listar todos los productos de la base usando handlebars y websockets. Actualiza en tiempo real frente a eliminacion o creacion de productos.
router.get("/realtimeproducts", async (req, res) => {
    try{
        const products = await productsManager.getAll(req.query);
        res.render("realTimeProducts", { title: "Modofit Market - Productos en tiempo real", products });
    }catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

export default router;