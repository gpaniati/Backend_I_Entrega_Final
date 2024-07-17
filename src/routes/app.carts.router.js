import { Router } from "express";
import CartsManager from "../managers/CartsManager.js"
import { ERROR_SERVER } from "../constants/messages.constant.js";

const router = Router();

const cartsManager = new CartsManager();

// Endpoint: Método GET que escucha en la URL http://localhost:8080/carts/:cid
// Lista los productos del carrito.
router.get("/carts/:cid", async (req, res) => {
    try{

        const cartSelected= await cartsManager.getOneById(req.params.cid);
        //Datos para pasar a la vista de carrito.
        const { _cid, products }  = cartSelected;
        res.status(200).render("cart", { title: "ModoFit Market / Carrito", products });

    }catch (error) {
        res.status(500).send(`<h1>Error 500</h1><h3>${ERROR_SERVER}</h3>`);
    }
});

export default router;