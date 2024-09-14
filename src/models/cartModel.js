import mongoose from 'mongoose';
import productModel from "./productModel"

const cartColl = "cart"

const cartSchema = new mongoose.Schema({
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

cartSchema.pre("find",function(){
    this.populate("products.product")
})

const productModel = (
    "product",
    cartSchema
)

export const CartModel = mongoose.model(
    cartColl, 
    cartSchema
)