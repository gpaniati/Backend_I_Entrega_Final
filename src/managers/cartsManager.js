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

            const cart = await this.#cartModel.findById(id).populate("products");

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
            const newCart = new CartModel();
            await newCart.save();
            return newCart;
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }
            throw new Error(error.message);
        }
    };

    updateOneByIds = async (cid, pid) => {
        try {Asi
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
                const newProduct = {
                    id: pid,
                    quantity: 1
                }

                cartFound.products.push(newProduct);
                await cartFound.save();

            }else{

                //Si existe, suma 1 ocurrencia al producto agregado y actualiza el carrito
                const productFilter = cartFound.products.filter((product) => product.id != pid);

                const { id, quantity } = productFound;
                let quantityN = Number(quantity);
                quantityN++;

                const productUpdated = {
                    id: pid,
                    quantity: quantityN
                }

                productFilter.push(productUpdated);
                cartFound.products = productFilter;
                await cartFound.save();
            }
        return cartFound;
    } catch (error) {
        throw new Error(error.message);
    }
};
}