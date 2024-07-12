import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js"
import { ERROR_SERVER } from "../constants/messages.constant.js";

const router = Router();

const productsManager = new ProductsManager();

// Endpoint: Método GET que escucha en la URL http://localhost:8080/products
// Listar todos los productos de la base usando solo handlebars.
router.get("/", async (req, res) => {
    try{
        //const productos = await productsManager.getAll(req.query);
        const products = await productsManager.getAll();
        res.status(200).render("index", { title: "productos", products });
    }catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});


/*
// Endpoint: Método GET que escucha en la URL http://localhost:8080/realtimeproducts
// Listar todos los productos de la base usando handlebars y websockets. Actualiza en tiempo real frente a eliminacion o creacion de productos.
router.get("/realtimeproducts", async (req, res) => {
    const productos = await baseProducts.consultarProductos();
    res.render("realTimeProducts", { title: "Productos en tiempo real", productos });
});
*/
export default router;