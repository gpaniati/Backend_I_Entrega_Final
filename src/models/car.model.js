import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    // RELACIÓN FÍSICA 0:N - ! carrtito , 0 a N productos
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
        quantity: {
            type: Number,
            required: [ true, "La cantidad de productos es obligatoria" ],
            min: 0,
            max: 100
        }
    }],
    // Añade timestamps para generar createdAt y updatedAt
    timestamps: true,
});

const CartModel = model("carts", cartSchema);

export default CartModel;