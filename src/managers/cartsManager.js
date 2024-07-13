import mongoose from "mongoose";
import CartModel from "../models/car.model.js";
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
}