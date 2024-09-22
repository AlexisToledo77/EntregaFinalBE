import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: "products"
                    }, 
                    quantity: Number
                }
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
)

cartSchema.pre("findOne", function(next) {
    this.populate("products.product");
    this.lean();
    next();
});

cartSchema.pre("findOneAndUpdate", function(next) {
    this.populate("products.product");
    this.lean();
    next();
});

export const cartsModel = mongoose.model("carts", cartSchema)