import { cartsModel } from "../models/cartModel.js"

export class CartManager {
    static async getById(id) {
        return await cartsModel.findOne({ _id: id });
    }

    static async create() {
        return await cartsModel.create({ products: [] });
    }

    static async update(id, cart) {
        return await cartsModel.findByIdAndUpdate(
            id,
            { $set: { products: cart.products } },
            { new: true, runValidators: true }
        ).lean();
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
        try {
            if (quantity < 0) {
                throw new Error("La cantidad no puede ser negativa.");
            }
            await Cart.updateOne(
                { _id: cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } }
            );
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw new Error("Error al actualizar la cantidad del producto en el carrito.");
        }
    }

    // static async updateProductQuantity(cid, pid, quantity) {
    //     return await cartsModel.findOneAndUpdate(
    //         { _id: cid, 'products.product': pid },
    //         { $set: { 'products.$.quantity': quantity } },
    //         { new: true }
    //     ).lean();
    // }

    static async clearCart(id) {
        return await cartsModel.findByIdAndDelete(id).lean()
    }

    static async removeProductFromCart(cid, pid) {
        return await cartsModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { _id: pid } } },
            { new: true }
        ).lean()
    }

    static async paginate(filter, options) {
        try {
            return await cartsModel.paginate(filter, options)
        } catch (error) {
            console.log(error);
            throw new Error('Error al paginar productos')
        }
    }

    static async addProductInCart({ _id: cartId }) {
        let cart = await this.getCartById(cartId)
        if (!cart) {

            let newCart = await this.addCart({ products: [{ product: obj.product, quantity: obj.quantity }] })
            return newCart;
        }

        let productIndex = cart.products.findIndex(item => item.product.toString() === obj.product)

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += obj.quantity
        } else {
            cart.products.push({ product: obj.product, quantity: obj.quantity })
        }

        let result = await cartsModel.updateOne({ _id: cid }, { products: cart.products })
        return result
    }

}

