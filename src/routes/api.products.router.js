import { Router } from "express";
import ProductsManager from "../managers/ProductsManager.js";
import uploader from "../utils/uploader.js";

const router = Router();
const productsManager = new ProductsManager();

// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/products
// Listar todos los productos de la base.
router.get("/", async (req, res) => {
    try{
        const products = await productsManager.getAll();
        res.status(200).json({ status: true, payload: products });
    }catch(error){
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el server" });
    }
});

// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/products/:id
// Lista el producto de id pasado por parámetro.
router.get("/:id", async (req, res) => {
    try{
        const productFound = await productsManager.getOneId(req.params.id);

        if (!productFound) {
            return res.status(404).json({ status: false, message: "Id incorrecto" });
        }
        res.status(200).json({ status: true, payload: productFound });
    }catch(error){
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el server" });
    }
});

// Endpoint: Método POST que escucha en la URL http://localhost:8080/api/products/
router.post("/", uploader.single("file"), async (req, res) => {
    try{
        const { file } = req;
        const product = await productsManager.insertOne(req.body, file);

        res.status(200).json({ status: true, payload: product });
    }catch(error){
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el server" });
    }
});

// Endpoint: Método UPDATE que escucha en la URL http://localhost:8080/api/products/:id
// Lista el producto de id pasado por parámetro.
router.put("/:id", uploader.single("file"), async (req, res) => {
    try{
        const { file } = req;
        req.body.thumbnails = file?.filename ?? null;

        const productFound = await productsManager.getOneId(req.params.id);

        if (!productFound) {
            return res.status(404).json({ status: false, message: "Id incorrecto" });
        }
        const productUpdate = await productsManager.updateOne(req.params.id, productFound.thumbnails, req.body);

        res.status(200).json({ status: true, payload: productUpdate });
    }catch(error){
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el server" });
    }
});

// Endpoint: Método DELETE que escucha en la URL http://localhost:8080/api/products/:id
// Lista el producto de id pasado por parámetro.
router.delete("/:id", async (req, res) => {
    try{
        const productFound = await productsManager.getOneId(req.params.id);

        if (!productFound) {
            return res.status(404).json({ status: false, message: "Id incorrecto" });
        }

        await productsManager.deleteOne(req.params.id, productFound.thumbnails);

        res.status(200).json({ status: true, payload: productFound });
    }catch(error){
        console.log(error.message);
        res.status(500).json({ status: false, message: "Hubo un error en el server" });
    }
});

export default router;