import mongoose from "mongoose";
import { ProductModel } from "./productModel";

const cartColl = "cart"

const cartSchema = new mongoose.Schema(
    {
        mail: { type: String, required: true },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: { type: Number, default: 1 }
            }
        ],
    })



cartSchema.pre("findOne", function () {
    this.populate("products.product").lean()
})

cartSchema.pre("find", function () {
    this.populate("products.product").lean()
})

const cartModel = mongoose.model(
    cartColl,
    cartSchema
)

export { cartModel }