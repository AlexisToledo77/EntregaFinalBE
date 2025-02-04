
import { CartsDAO } from "../dao/cartsDAO.js"
import { ProductsDAO } from "../dao/productsDAO.js"
import { TicketController } from "../controller/ticketController.js"

export class CartsService {

    static async getCart(filter = {}) {
        try {
            return await CartsDAO.getCart(filter)
        } catch (error) {
            throw error
        }
    }

    static async purchaseCart(cid, userEmail) {
        try {
            const cart = await CartsDAO.getCartBy({ _id: cid })
            const { conStock, sinStock, total } = await this.procesaProducts(cart)

            if (conStock.length === 0) {
                throw new Error('No se pueden comprar los productos seleccionados o está vacío el carrito')
            }

            const ticket = await this.createTicket(conStock, total, userEmail)
            await this.UpdateSinStock(cid, sinStock)

            return {
                payload: 'Compra Realizada con Éxito',
                ticket
            }
        } catch (error) {
            throw error
        }
    }

    static async procesaProducts(cart) {
        const conStock = []
        const sinStock = []
        let total = 0

        for (const item of cart.products) {
            const producto = await ProductsDAO.getProductsBy({ _id: item.product })

            if (!producto || producto.stock < item.quantity) {
                sinStock.push({
                    _id: item.product._id,
                    cantidad: item.quantity
                })
            } else {
                conStock.push({
                    _id: item._id,
                    cantidad: item.quantity,
                    description: producto.description,
                    title: producto.title,
                    price: producto.price,
                    subtotal: producto.price * item.quantity
                })
                total += producto.price * item.quantity

                producto.stock -= item.quantity
                await ProductsDAO.updateProduct(item.product, producto)
            }
        }

        return { conStock, sinStock, total }
    }

    static async createTicket(detalle, total, comprador) {
        const nroComp = Date.now()
        const fecha = new Date()
        return await TicketController.generateTicket(
            nroComp,
            fecha,
            detalle,
            total,
            comprador
        )
    }

    static async UpdateSinStock(cid, sinStock) {
        const cartUpdate = {
            products: sinStock.map(product => ({
                product: product._id,
                quantity: product.cantidad
            }))
        }
        return await CartsDAO.update(cid, cartUpdate)
    }



    static async createCart() {
        try {
            const cart = await CartsDAO.create()
            return cart
        } catch (error) {
            console.error('Error al crear el carrito:', error)
            throw error
        }
    }

    static async getCartById(cid) {
        try {
            const cart = await CartsDAO.getCartById(cid)
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }
            return cart
        } catch (error) {
            console.error('Error al obtener el carrito:', error)
            throw error
        }
    }

    static async updateCart(cid, cartData) {
        try {
            const updatedCart = await CartsDAO.update(cid, cartData)
            if (!updatedCart) {
                throw new Error('Carrito no encontrado')
            }
            return updatedCart
        } catch (error) {
            console.error('Error al actualizar el carrito:', error)
            throw error
        }
    }

    static async deleteCart(cid) {
        try {
            const deletedCart = await CartsDAO.deleteCart(cid)
            if (!deletedCart) {
                throw new Error('Carrito no encontrado')
            }
            return deletedCart
        } catch (error) {
            console.error('Error al eliminar el carrito:', error)
            throw error
        }
    }

    static async addProductToCart(cid, productId, quantity) {
        try {
            const cart = await CartsDAO.getCartById(cid)
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId)
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity
            } else {
                cart.products.push({ product: productId, quantity })
            }

            const updatedCart = await CartsDAO.update(cid, cart)
            return updatedCart
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error)
            throw error
        }
    }

    static async updateProductQuantity(cid, pid, quantity) {
        try {
            const updatedCart = await CartsDAO.updateProductQuantity(cid, pid, quantity)
            if (!updatedCart) {
                throw new Error('Carrito no encontrado o producto no existe en el carrito')
            }
            return updatedCart
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error)
            throw error
        }
    }

    static async removeProductFromCart(cid, pid) {
        try {
            const updatedCart = await CartsDAO.removeProductFromCart(cid, pid)
            if (!updatedCart) {
                throw new Error('Carrito no encontrado o producto no existe en el carrito')
            }
            return updatedCart
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error)
            throw error
        }
    }

    static async clearCart(cid) {
        try {
            const clearedCart = await CartsDAO.clearCart(cid)
            if (!clearedCart) {
                throw new Error('Carrito no encontrado')
            }
            return clearedCart
        } catch (error) {
            console.error('Error al vaciar el carrito:', error)
            throw error
        }
    }
}

