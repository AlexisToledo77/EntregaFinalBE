import express from 'express'
import { cartsManager } from '../dao/cartsManager.js'
import { productsManager } from '../dao/productsManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const carts = await cartsManager.readFile()
  res.json(carts)
})

router.post('/', async (req, res) => {
  const { userId, products } = req.body
  const newCart = await cartsManager.addItem({ userId, products })
  const io = req.app.get('socketio')
  const updatedCart = await cartsManager.readFile()
  io.emit('cart', updatedCart)
  res.status(201).json(newCart)
})

router.get('/:id', async (req, res) => {
  const cart = await cartsManager.getItemById(parseInt(req.params.id))
  if (cart) {
    res.json(cart)
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' })
  }
})

router.post('/:id/product/:productId', async (req, res) => {
  const cart = await cartsManager.getItemById(parseInt(req.params.id))
  const product = await productsManager.getItemById(parseInt(req.params.productId))

  if (!cart || !product) {
    return res.status(404).json({ message: 'Carrito o producto no encontrado' })
  }

  const existingProductIndex = cart.products.findIndex(p => p.id === product.id)

  if (existingProductIndex !== -1) {
    cart.products[existingProductIndex].quantity += 1
  } else {
    cart.products.push({ ...product, quantity: 1 })
  }

  const updatedCart = await cartsManager.updateItem(cart.id, cart)
  res.json(updatedCart)
})

router.delete('/:id', async (req, res) => {
  await cartsManager.deleteItem(parseInt(req.params.id))
  const io = req.app.get('socketio')
  const updatedCarts = await cartsManager.readFile()
  io.emit('products', updatedCarts)
  res.status(204).end()
})

export default router