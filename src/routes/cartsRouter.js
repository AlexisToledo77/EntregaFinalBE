import express from 'express'
import { isValidObjectId } from 'mongoose'
import { procesaErrores } from '../utils.js'
import { CartManager } from '../dao/cartsManager.js'
import { ProductsManager } from '../dao/productsManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let carts = await CartManager.getCart()
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ carts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener usuarios' })
    }
})


router.get('/:id', async (req, res) => {

    let { id } = req.params
    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Ingrese un id válido de MongoDB` })
    }

    try {
        let cart = await CartManager.getById(id)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({ cart })
    } catch (error) {
        return procesaErrores(res, error)
    }
})

router.post("/", async (req, res) => {
    try {
        let cart = await CartManager.create()
        res.setHeader('Content-Type', 'application/json')
        return res.status(201).json({ cart });
    } catch (error) {
        return procesaErrores(res, error)
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    let { pid, cid } = req.params
    if (!isValidObjectId(pid) || !isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Algún id tiene formato inválido. Verifique...!!!` })
    }

    try {
        let cart = await CartManager.getById(cid)
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe cart con id ${cid}` })
        }

        let product = await ProductsManager.getBy({ _id: pid })
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
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

        let resultado = await CartManager.update(cid, cart)
        if (resultado) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: "Carrito actualizado", payload: resultado })
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Fallo en la actualización` })
        }
    } catch (error) {
        return procesaErrores(res, error)
    }
})


router.put('/:cid', async (req, res) => {
    try {
        let cart = await CartManager.updateCart(req.params.cid, req.body.products)
        res.json({ status: 'success', payload: cart })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    let { quantity } = req.body
    quantity = Number(quantity)

    if (Object.keys(req.body).length !== 1 || isNaN(quantity) || quantity <= 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Solo se permite modificar la cantidad y debe ser un número positivo' })
    }
    try {
        let cart = await CartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity)
        res.json({ status: 'success', payload: cart })
    } catch (error) {
        console.error(`Error updating product quantity: ${error.message}`)
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    let { cid, pid } = req.params
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: 'Ingrese un id válido de MongoDB' })
    }
    try {
        let cart = await CartManager.removeProductFromCart(req.params.cid, req.params.pid)
        res.json({ status: 'Se elimino el producto', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        let cart = await CartManager.clearCart(req.params.cid)
        res.json({ status: 'success', message: 'Todos los productos han sido eliminados del carrito' })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
})

export default router