import express from 'express'
import { CartsManager } from '../dao/cartsManager.js'
import { productsManager } from '../dao/productsManager.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        let newCart = await CartsManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.get('/', async (req, res) => {
  let carts = await CartsManager.getCart()
  res.json(carts)
})

router.post('/', async (req, res) => {
  let { userId, products } = req.body
  let newCart = await CartsManager.addItem({ userId, products })
  let io = req.app.get('socketio')
  let updatedCart = await CartsManager.readFile()
  io.emit('cart', updatedCart)
  res.status(201).json(newCart)
})

router.get('/:id', async (req, res) => {
  let cart = await CartsManager.getItemById(parseInt(req.params.id))
  if (cart) {
    res.json(cart)
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' })
  }
})

router.post('/:id/product/:productId', async (req, res) => {
  let cart = await CartsManager.getItemById(parseInt(req.params.id))
  let product = await productsManager.getItemById(parseInt(req.params.productId))

  if (!cart || !product) {
    return res.status(404).json({ message: 'Carrito o producto no encontrado' })
  }

  let existingProductIndex = cart.products.findIndex(p => p.id === product.id)

  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += 1
  } else {
    cart.products.push({ ...product, quantity: 1 })
  }

  let updatedCart = await CartsManager.updateItem(cart.id, cart)
  res.json(updatedCart)
})

router.delete('/:id', async (req, res) => {
  await CartsManager.deleteItem(parseInt(req.params.id))
  let io = req.app.get('socketio')
  let updatedCarts = await CartsManager.readFile()
  io.emit('products', updatedCarts)
  res.status(204).end()
})

export default router