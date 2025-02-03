import { CartsDAO } from "../dao/cartsDAO.js"
import { procesaErrores } from "../utils.js"
import { isValidObjectId } from 'mongoose'
import { ProductsDAO } from '../dao/productsDAO.js'
import { ticketModel } from "../models/ticketModel.js"
import { TicketController } from "../controller/ticketController.js"

export class CartsController {

    static async getCarts(req, res) {
        try {
            let carts = await CartsDAO.getCart()
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ carts })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al obtener usuarios' })
        }
    }

    static async purchaseCart(req, res) {
        let { cid } = req.params;

        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ingrese un id valido de Carrito` });
        }

        if (req.user.cart != cid) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El Cart no pertenece al usuario autenticado` });
        }

        try {
            let cart = await CartsDAO.getCartBy({ _id: cid });

            let conStock = []
            let sinStock = []
            let total = 0

            for (let i = 0; i < cart.products.length; i++) {

                let producto = await ProductsDAO.getProductsBy({ _id: cart.products[i].product })

                if (!producto || producto.stock < cart.products[i].quantity) {
                    sinStock.push({
                        _id: cart.products[i].product._id,
                        cantidad: cart.products[i].quantity

                    })
                    console.log(sinStock)
                } else {
                    conStock.push({
                        _id: cart.products[i]._id,
                        cantidad: cart.products[i].quantity,
                        description: producto.description,
                        title: producto.title,
                        price: producto.price,
                        subtotal: producto.price * cart.products[i].quantity
                    })
                    total += producto.price * cart.products[i].quantity

                    //Stock
                    producto.stock = producto.stock - cart.products[i].quantity
                    await ProductsDAO.updateProduct(cart.products[i].product, producto)
                }
            }

            if (conStock.length == 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No se pueden comprar los productos seleccionados o esta vacio el carrito` })
            }
            
            //Ticket
            let nroComp = Date.now()
            let fecha = new Date()
            let detalle = conStock
            let comprador = req.user.email

            // let ticket = await ticketModel.create({
            //     nroComp, fecha, detalle, total, comprador
            // })

            let ticket = await TicketController.generateTicket(
                nroComp, 
                fecha, 
                detalle, 
                total, 
                comprador
            )

            cart.products = sinStock.map(product => ({
                product: product._id,
                quantity: product.cantidad
            })
            )
            await CartsDAO.update(cid, cart)


            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: `Compra Realizada con Exito`, ticket });

        } catch (error) {
            procesaErrores(error, res)
        }
    }

    static async getCartsById(req, res) {

        let { id } = req.params
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ingrese un id válido de MongoDB` })
        }

        try {
            let cart = await CartsDAO.getById(id)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({ status: 'success', payload: cart })
        } catch (error) {
            return procesaErrores(res, error)
        }
    }

    static async create(req, res) {
        try {
            let cart = await CartsDAO.create()
            res.setHeader('Content-Type', 'application/json')
            return res.status(201).json({ cart })
        } catch (error) {
            return procesaErrores(res, error)
        }
    }

    static async addProductToCart(req, res) {
        let { pid, cid } = req.params
        if (!isValidObjectId(pid) || !isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `Algún id tiene formato inválido. Verifique...!!!` })
        }

        try {
            let cart = await CartsDAO.getById(cid)
            if (!cart) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `No existe cart con id ${cid}` })
            }

            let product = await ProductsDAO.getBy({ _id: pid })
            if (!product) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `No existe product con id ${pid}` })
            }
            console.log(JSON.stringify(cart, null, 5))

            let indiceProducto = cart.products.findIndex(p => p.product._id == pid)
            if (indiceProducto === -1) {
                cart.products.push({
                    product: pid, quantity: 1
                })
            } else {
                cart.products[indiceProducto].quantity++
            }

            let resultado = await CartsDAO.update(cid, cart)
            if (resultado) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(200).json({ message: "Carrito actualizado", payload: resultado })
            } else {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `Fallo en la actualización` })
            }
        } catch (error) {
            return procesaErrores(res, error)
        }
    }

    static async update(req, res) {
        try {
            let cart = await CartsDAO.updateCart(req.params.cid, req.body.products)
            res.json({ status: 'success', payload: cart })
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }

    static async updateQuantity(req, res) {
        let { quantity } = req.body
        quantity = Number(quantity)

        if (Object.keys(req.body).length !== 1 || isNaN(quantity) || quantity <= 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Solo se permite modificar la cantidad y debe ser un número positivo' })
        }
        try {
            let cart = await CartsDAO.updateProductQuantity(req.params.cid, req.params.pid, quantity)
            res.json({ status: 'success', payload: cart })
        } catch (error) {
            console.error(`Error updating product quantity: ${error.message}`)
            res.status(500).json({ status: 'error', error: error.message })
        }
    }

    static async deleteProductInCar(req, res) {
        let { cid, pid } = req.params
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: 'Ingrese un id válido de MongoDB' })

        }
        try {

            let cart = await CartsDAO.removeProductFromCart(req.params.cid, req.params.pid)

            res.json({ status: 'Se elimino el producto', cart })
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }

    static async deleteCart(req, res) {
        try {
            const cart = await CartsDAO.deleteCart(req.params.cid)
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' })
            }
            res.status(200).json({ message: 'Carrito Elliminado con éxito' })
        } catch (error) {
            res.status(500).json({ message: 'Error al Elliminar el carrito', error })
        }
    }

}