import { CartModel } from "../models/cartModel.js"

export class CartsManager {
    static async getCart() {
        return await CartModel.find().lean()
    }

    static async getCartsBy(filtro = {}) {
        return await CartModel.findOne(filtro).lean()
    }

    static async createCart() {
        return await CartModel.create()
    }

    static async addCart(cart){
        return await CartModel.create({product:[]});
    }

    static async update(id, aModificar = {}) {
        return await CartModel.findByIdAndUpdate(id, aModificar, { new: true }).lean()
    }

    static async deleteCart(id) {
        return await CartModel.findByIdAndDelete(id).lean()
    }

    static async paginate(filter, options) {
        try {
            return await CartModel.paginate(filter, options);
        } catch (error) {
            console.log(error);
            throw new Error('Error al paginar productos');
        }
    }

    static async addProductInCart({_id: cartId}) {
        let cart = await this.getCartById(cartId);
        if (!cart) {
            // Si el carrito no existe, créalo
            let newCart = await this.addCart({ products: [{ product: obj.product, quantity: obj.quantity }] });
            return newCart;
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === obj.product);

        if (productIndex !== -1) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            cart.products[productIndex].quantity += obj.quantity;
        } else {
            // Si el producto no está en el carrito, agrégalo
            cart.products.push({ product: obj.product, quantity: obj.quantity });
        }

        const result = await cartModel.updateOne({ _id: cid }, { products: cart.products });
        return result;
    }

}



export const cartsManager = new CartsManager('./src/data/carts.json')