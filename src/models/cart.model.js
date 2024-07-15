import { Schema, model } from "mongoose";

    const cartSchema = new Schema({
        products: [{
            _id: { type: Schema.Types.ObjectId, ref: "products", required: true},
            quantity: { type: Number, required: true }}],
    });


    cartSchema.pre(/^find/, function(next) {
        this.populate("products._id");
        next();
    });

const CartModel = model("carts", cartSchema);

export default CartModel;