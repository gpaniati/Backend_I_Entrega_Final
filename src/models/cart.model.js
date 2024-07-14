import { Schema, model } from "mongoose";

    const productSchema = new Schema({
        _id: { type: Schema.Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, required: true },
    });

    const cartSchema = new Schema({
        products: [productSchema],
    });

    cartSchema.pre(/^find/, function(next) {
        this.populate("products");
        next();
    });

    /*
    // RELACIÓN FÍSICA 0:N - ! carrtito , 0 a N productos
    products: [{
        type: Schema.Types.ObjectId,
        ref: "products",
    }],
    /*
    products: [
        // RELACIÓN FÍSICA 0:N - ! carrtito , 0 a N productos
        {id: {
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
});
*/

const CartModel = model("carts", cartSchema);

export default CartModel;