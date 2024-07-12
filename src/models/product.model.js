import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        type: String,
        required: [ true, "El título es obligatorio" ],
        trim: true
    },
    description: {
        type: String,
        required: [ true, "La descripción es obligatoria" ],
        trim: true,
        maxLength: [ 100, "La descripcion  debe tener como máximo 100 caracteres" ]
    },
    code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: [ true, "El precio es obligatorio" ],
        min: 1,
        max: 10000
    },
    status: {
        type: Boolean,
        required: [ true, "El status/disponibilidad es obligatoria" ],
    },
    stock: {
        type: Number,
        required: [ true, "El stock es obligatorio" ],
        min: 0,
        max: 100
    },
    category: {
        type: String,
        required: [ true, "La categoria es obligatoria" ]
    },
    thumbnails: {
        type: String,
        required: [ true, "La imagen es obligatoria" ],
        trim: true,
    }
});

// Índice simple para buscar por categoría
productSchema.index({ category: 1 }, { name: "idx_category" });
1
// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;