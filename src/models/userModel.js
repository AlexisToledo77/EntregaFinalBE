import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const usersColl="users"
const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true },
},
{
    timestamps: true
}
);

usersSchema.plugin(mongoosePaginate)

export const UserModel = mongoose.model(
    usersColl, 
    usersSchema
)

