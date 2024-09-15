import { cartsModel } from "../models/cartModel.js"

export class CartManager{
    static async getById(id){
        return await cartsModel.findOne({_id:id})
    }

    static async create(){
        return await cartsModel.create({products:[]})
    }

    static async update(id, cart){
        return await cartsModel.updateOne({_id:id}, cart)
    }
    static async getCart() {
        return await cartsModel.find().lean()
    }

    static async getCartsBy(filtro = {}) {
        return await cartsModel.findOne(filtro).lean()
    }

    static async createCart() {
        return await cartsModel.create()
    }

    static async addCart(cart){
        return await cartsModel.create({product:[]})
    }

    static async update(id, aModificar = {}) {
        return await cartsModel.findByIdAndUpdate(id, aModificar, { new: true }).lean()
    }

    static async deleteCart(id) {
        return await cartsModel.findByIdAndDelete(id).lean()
    }

    static async paginate(filter, options) {
        try {
            return await cartsModel.paginate(filter, options)
        } catch (error) {
            console.log(error);
            throw new Error('Error al paginar productos')
        }
    }

    static async addProductInCart({_id: cartId}) {
        let cart = await this.getCartById(cartId)
        if (!cart) {
            
            let newCart = await this.addCart({ products: [{ product: obj.product, quantity: obj.quantity }] })
            return newCart;
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === obj.product)

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += obj.quantity
        } else {
            cart.products.push({ product: obj.product, quantity: obj.quantity })
        }

        const result = await cartsModel.updateOne({ _id: cid }, { products: cart.products })
        return result
    }

}

