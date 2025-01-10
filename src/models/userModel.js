import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const usersColl = "users"
const usersSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: { type: String, required: true },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    role: { type: String, default: "user" },

},
    {
        timestamps: true
    })

usersSchema.plugin(mongoosePaginate)

export const UserModel = mongoose.model(
    usersColl,
    usersSchema
)
