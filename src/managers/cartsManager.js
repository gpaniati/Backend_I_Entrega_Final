import mongoose from "mongoose";
import CartModel from "../models/cart.model.js";
import mongoDB from "../config/mongoose.config.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

export default class CartManager {
    #cartModel;

    constructor () {
        this.#cartModel = CartModel;
    }

    getAll = async () => {
        try {
            const carts = await this.#cartModel.find().lean();
            return carts;
        }catch(error){
            throw new Error(error.message);
        }
    };

    getOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cart = await this.#cartModel.findById(id);

            if (!cart) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    insertOne = async () => {
        try {
            const newCart = new CartModel( {products: []});
            await newCart.save();
            return newCart;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }
            throw new Error(error.message);
        }
    };

    updateOneByCidPid = async (cid, pid) => {
        try {
            if ((!mongoDB.isValidID(cid)) && (!mongoDB.isValidID(pid))) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(cid);
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            //Valida si ya existe el producto a agregar al carrito en el mismo
            const productFound = cartFound.products.find((product) => product.id == pid);
            if (!productFound){
                //const productId = new mongoose.Types.ObjectId(pid);
                cartFound.products.push( {_id: pid, quantity: 1 });
                await cartFound.save();
            }else{
                //Si existe, suma 1 ocurrencia al producto agregado y actualiza el carrito
                const productFilter = cartFound.products.filter((product) => product.id != pid);

                productFound.quantity++;
                productFilter.push(productFound);

                cartFound.products = productFilter;
                await cartFound.save();
            }
        return cartFound;
        } catch (error) {
            throw new Error(error.message);
        };
    };

    updateOneByQuantity = async (cid, pid, quantity) => {
        try {
            if ((!mongoDB.isValidID(cid)) && (!mongoDB.isValidID(pid))) {
                throw new Error(ERROR_INVALID_ID);
            }

            const cartFound = await this.#cartModel.findById(cid);
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            //Si existe el producto, agrega la cantidad pasada desde req.body.
            const productIndexFound = cartFound.products.findIndex((product) => product.id == pid);
            if (productIndexFound !== -1){

                cartFound.products[productIndexFound].quantity = quantity;
                await cartFound.save();
                return cartFound;

            }else{
                throw new Error(ERROR_NOT_FOUND_ID);
            }
        } catch (error) {
            throw new Error(error.message);
        };
    };

    updateOneByCid = async (cid, productsArray) => {
        try {
            if (!mongoDB.isValidID(cid)) {
                return null;
            }

            console.log(productsArray);
            const cartFound = await this.#cartModel.findById(cid);
            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            //Updetea los productos con el nuevo array de productos.
            cartFound.products = productsArray;
            await cartFound.save();
            return cartFound;

        } catch (error) {
            throw new Error(error.message);
        };
    };

    deleteProductsByCid = async (cid) => {
        try {
            if (!mongoDB.isValidID(cid)) {
                throw new Error(ERROR_INVALID_ID);
            }

            //Valida si existe el carrito a vaciar.
            const cartFound = await this.#cartModel.findById(cid);

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            cartFound.products = [];
            await cartFound.save();

            return cartFound;

        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteProductByCidPid = async (cid, pid) => {
        try {
            if ((!mongoDB.isValidID(cid)) && (!mongoDB.isValidID(pid))) {
                throw new Error(ERROR_INVALID_ID);
            }

            //Valida si existe el carrito a vaciar.
            const cartFound = await this.#cartModel.findById(cid);

            if (!cartFound) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            //Si existe el producto, agrega la cantidad pasada desde req.body.
            const productIndexFound = cartFound.products.findIndex((product) => product.id == pid);

            if (productIndexFound !== -1) {

                cartFound.products.splice(productIndexFound, 1);
                await cartFound.save();
                return cartFound;

            } else {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

        } catch (error) {
            throw new Error(error.message);
        }
    };
}