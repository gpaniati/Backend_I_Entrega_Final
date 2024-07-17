import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";
import fileSystem from "../utils/fileSystem.js";

import {
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND_ID,
} from "../constants/messages.constant.js";

export default class ProductsManager {
    #productModel;

    constructor () {
        this.#productModel = ProductModel;
    }

    getAllReal = async () => {
        try {

            const products = await this.#productModel.find().lean();
            return products;

        }catch(error){
            throw new Error(error.message);
        }
    };


    getAll = async (paramFilters) => {
        try {

            const $and = [];
            //Disponibilidad: true : Disponible ; false: No disponible
            if (paramFilters?.status) $and.push({ name:  paramFilters.status });
            if (paramFilters?.category) $and.push({ category:  paramFilters.category });

            const filters = $and.length > 0 ? { $and } : {};

            //Parametro SORT del request (0 o 1);
            //Posicion 0 del vector (price:1 => ascendente)
            //Posicion 1 del vector (price:-1 => descendente)
            const sort = [ { price: 1 }, { price: -1 } ];

            const paginationOptions = {
                limit: paramFilters.limit ?? 10,
                page: paramFilters.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                lean: true,
            };

            const products = await this.#productModel.paginate(filters, paginationOptions);
            return products;

        }catch(error){
            throw new Error(error.message);
        }
    };

    getOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const product = await this.#productModel.findById(id).lean();

            if (!product) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    insertOne = async (data, file) => {
        try{
            const productCreated = new ProductModel(data);

            productCreated.thumbnails = file?.filename ?? null;

            await productCreated.save();
            return productCreated;
        }catch (error) {
            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    insertOneDefault = async (data, file) => {
        try{
            const productCreated = new ProductModel(data);
            productCreated.thumbnails = file;

            await productCreated.save();
            return productCreated;
        }catch (error) {
            throw new Error(error.message);
        }
    };


    updateOneById = async (id, data, file) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const product = await this.#productModel.findById(id);
            const currentThumbnail = product.thumbnails;
            const newThumbnail = file?.filename;

            if (!product) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            product.title = data.title;
            product.description = data.description;
            product.code = data.code;
            product.price = data.price;
            product.status = data.status;
            product.stock = data.stock;
            product.category = data.category;
            product.thumbnails = newThumbnail ?? currentThumbnail;

            await product.save();

            if (file && newThumbnail != currentThumbnail) {
                await fileSystem.deleteImage(currentThumbnail);
            }

            return product;
        } catch (error) {
            if (file) await fileSystem.deleteImage(file.filename);

            if (error instanceof mongoose.Error.ValidationError) {
                error.message = Object.values(error.errors)[0];
            }

            throw new Error(error.message);
        }
    };

    deleteOneById = async (id) => {
        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error(ERROR_INVALID_ID);
            }

            const product = await this.#productModel.findById(id);

            if (!product) {
                throw new Error(ERROR_NOT_FOUND_ID);
            }

            await this.#productModel.findByIdAndDelete(id);
            if (product.thumbnails != "modofit_producto_sin_imagen.png"){
                await fileSystem.deleteImage(product.thumbnails);
            }

            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}