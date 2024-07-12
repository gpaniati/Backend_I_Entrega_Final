import ProductModel from "../models/product.model.js";
import mongoDB from "../config/mongoose.config.js";
import fileSystem from "../utils/fileSystem.js";

export default class ProductsManager {
    #productModel;

    constructor () {
        this.#productModel = ProductModel;
    }

    getAll = async () => {
        /*  El método lean() utiliza después del método find() para
            devolver los documentos como objetos JavaScript simples
            en lugar de instancias de un Model de Mongoose.
        */
        const products = await this.#productModel.find().lean();
        return products;
    };

    getOneId = async (id) => {
        if (!mongoDB.isValidID(id)){
            return null;
        }
        const product = await this.#productModel.findById(id);
        return product;
    };

    insertOneById = async (data, file) => {
        try{
            const productCreated = new ProductModel(data);
            productCreated.thumbnails = file?.filename ?? null;

            await productCreated.save();
            return productCreated;
        }catch (error) {
            console.log(error.message);
            await fileSystem.deleteImage(data.thumbnail);
            throw new Error("Faltan datos");
        }
    };

    updateOneById = async (id, thumbnail, data) => {
        try{
            if (!mongoDB.isValidID(id)){
                return null;
            }
            const options = {
                new: true,
            };
            const product = await this.#productModel.findByIdAndUpdate(id, data, options);

            if (thumbnail != data.thumbnail) {
                //Verificar q se borre la imagen.
                await fileSystem.deleteImage(thumbnail);
            }
            return product;
        }catch (error) {
            console.log(error.message);
            throw new Error("Faltan datos");
        }
    };

    deleteOneById = async (id, thumbnail) => {
        if (!mongoDB.isValidID(id)){
            return null;
        }
        const product = await this.#productModel.findByIdAndDelete(id);
        console.log(thumbnail);
        await fileSystem.deleteImage(thumbnail);

        return product;
    };
}