import mongoose from 'mongoose';

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

cartSchema.pre("findById",function(){
    this.populate("products.product")
})



export const CartModel = mongoose.model(
    cartColl, 
    cartSchema
)