import { cartsModel } from '../models/cartModel.js'

export class CartsDAO {
    static async create() {
        return await cartsModel.create({ products: [] })
    }

    static async update(id, cart) {
        return await cartsModel.updateOne({ _id: id }, cart)
    }

    static async getCart(filter = {}) {
        return await cartsModel.find(filter).lean()
    }

    static async getCartBy(filtro = {}) {
        return await cartsModel.findOne(filtro).lean()
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

    static async clearCart(cartId) {
        return await cartsModel.updateOne(
            { _id: cartId },
            { $set: { products: [] } }
        )
    }

    static async removeProductFromCart(cid, pid) {
        try {
            const updatedCart = await cartsModel.findByIdAndUpdate(
                cid,
                { $pull: { products: { product: pid } } },
                { new: true }
            ).lean()

            if (!updatedCart) {
                throw new Error('Carrito no encontrado o producto no existe en el carrito')
            }

            return updatedCart
        } catch (error) {
            console.error('Error eliminando el producto del carrito:', error)
            throw error
        }
    }

    static async deleteCart(id) {
        try {
            const cart = await cartsModel.findByIdAndDelete(id).lean()
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }
            return cart
        } catch (error) {
            console.error('Error al eliminar el carrito:', error)
            throw error
        }
    }
}

