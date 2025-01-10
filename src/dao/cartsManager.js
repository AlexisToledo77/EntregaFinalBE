import { cartsModel } from "../models/cartModel.js"

export class CartManager {
    static async getById(id) {
        return await cartsModel.findOne({ _id: id })
    }

    static async create() {
        return await cartsModel.create({ products: [] })
    }

    static async update(id, cart) {
        return await cartsModel.updateOne({ _id: id }, cart)
    }
    static async getCart() {
        return await cartsModel.find().lean()
    }

    static async createCart() {
        return await cartsModel.create()
    }

    static async addCart(cart) {
        return await cartsModel.create({ product: [] })
    }

    static async getCartById(cid) {
        try {
            let cart = await cartsModel.findById(cid).populate('products.product')
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }
            return cart
        } catch (error) {
            console.error("Error al obtener el carrito:", error.message)
            throw error
        }
    }

    static async updateProductQuantity(cid, pid, quantity) {
        return await cartsModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        ).lean()
    }

    static async clearCart(cid) {
        try {
            const cart = await cartsModel.findByIdAndUpdate(
                cid,
                { $set: { products: [] } },
                { new: true }
            );
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }
            return cart
        } catch (error) {
            console.error('Error al vaciar el carrito:', error)
            throw error
        }
    }

    static async removeProductFromCart(cid, pid) {
        try {
            const updatedCart = await cartsModel.findByIdAndUpdate(
                cid,
                { $pull: { products: { product: pid } } },
                { new: true }
            ).lean();

            if (!updatedCart) {
                throw new Error('Carrito no encontrado o producto no existe en el carrito')
            }

            return updatedCart
        } catch (error) {
            console.error('Error eliminando el producto del carrito:', error)
            throw error;
        }
    }

    static async paginate(filter, options) {
        try {
            return await cartsModel.paginate(filter, options)
        } catch (error) {
            console.log(error);
            throw new Error('Error al paginar productos')
        }
    }
}

