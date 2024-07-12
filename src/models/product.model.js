import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxLength: 100 },
    code: { type: String, required: true, uppercase: true },
    price: { type: Number, min: 0, max: 10000 },
    status: { type: Boolean, required: true },
    stock: { type: Number, min: 0, max: 100 },
    category: { type: String, required: true },
    thumbnails: { type: String, required: false, trim: true },
});

const ProductModel = model("products", productSchema);

export default ProductModel;