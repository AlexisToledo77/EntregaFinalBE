import { CartsService } from '../services/cart.service.js'
import { isValidObjectId } from 'mongoose'
import { procesaErrores } from "../utils.js"

export class CartsController {

    static async getCarts(req, res) {
        console.log('Route handler called')
        try {
            const carts = await CartsService.getCart()
            return res.status(200).json({ carts })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    static async purchaseCart(req, res) {
        let { cid } = req.params

        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `Ingrese un id valido de Carrito` })
        }

        if (req.user.cart != cid) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `El Cart no pertenece al usuario autenticado` })
        }

        try {
            const result = await CartsService.purchaseCart(cid, req.user.email)
            return res.status(200).json(result)
        } catch (error) {
            return procesaErrores(error, res)
        }
    }

    static async getCartsById(req, res) {
        let { id } = req.params
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: 'Ingrese un id válido de MongoDB' })
        }

        try {
            let cart = await CartsService.getCartById(id)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({ status: 'success', payload: cart })
        } catch (error) {
            return procesaErrores(res, error)
        }
    }

    static async create(req, res) {
        try {
            let cart = await CartsService.createCart()
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
            return res.status(400).json({ error: 'Algún id tiene formato inválido. Verifique...!!!' })
        }

        try {
            let cart = await CartsService.addProductToCart(cid, pid, 1)
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ message: 'Carrito actualizado', payload: cart })
        } catch (error) {
            return procesaErrores(res, error)
        }
    }

    static async update(req, res) {
        try {
            let cart = await CartsService.updateCart(req.params.cid, req.body.products)
            res.json({ status: 'success', payload: cart })
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }

    static async updateQuantity(req, res) {
        let { quantity } = req.body
        quantity = Number(quantity)

        if (Object.keys(req.body).length !== 1 || isNaN(quantity) || quantity <= 0) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: 'Solo se permite modificar la cantidad y debe ser un número positivo' })
        }
        try {
            let cart = await CartsService.updateProductQuantity(req.params.cid, req.params.pid, quantity)
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
            let cart = await CartsService.removeProductFromCart(cid, pid)
            res.json({ status: 'Se elimino el producto', cart })
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }

    static async deleteCart(req, res) {
        try {
            const cart = await CartsService.deleteCart(req.params.cid)
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' })
            }
            res.status(200).json({ message: 'Carrito eliminado con éxito' })
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el carrito', error })
        }
    }

    static async clearCart(req, res) {
        try {
            const cart = await CartsService.clearCart(req.params.cid)
            res.json({ status: 'Se eliminaron todos los productos del carrito', cart })
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }
}