import { cartsModel } from "../models/cartModel.js"


export class CartManager {

    static async updateQuantity(cid, pid, quantity, action) {
        try {
          const cart = await this.getCartById(cid);
          if (!cart) {
            throw new Error("Carrito no encontrado");
          }
    
          const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);
          if (productIndex !== -1) {
            if (action === "increase") {
              cart.products[productIndex].quantity += 1;
            } else if (action === "decrease") {
              cart.products[productIndex].quantity -= 1;
              if (cart.products[productIndex].quantity < 1) {
                cart.products.splice(productIndex, 1);
              }
            }
          }
    
          await cartsModel.updateOne({ _id: cid }, { products: cart.products });
          return cart;
        } catch (error) {
          console.error("Error al actualizar la cantidad del producto:", error);
          throw new Error("Error al actualizar la cantidad del producto.");
        }
      }
    
      static async removeFromCart(cid, pid) {
        try {
          const cart = await this.getCartById(cid);
          if (!cart) {
            throw new Error("Carrito no encontrado");
          }
    
          const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);
          if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
          }
    
          await cartsModel.updateOne({ _id: cid }, { products: cart.products });
          return cart;
        } catch (error) {
          console.error("Error al eliminar el producto del carrito:", error);
          throw new Error("Error al eliminar el producto del carrito.");
        }
      }
      
    static async getCartProducts(cid) {
        try {
            const cart = await cartsModel.findById(cid).populate("products.product").lean();
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener los productos del carrito:", error);
            throw new Error("Error al obtener los productos del carrito.");
        }
    }
        
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


