import express from 'express'
import { productsManager } from '../dao/productsManager.js'

const router = express.Router()
const products = await productsManager.readFile()

router.get('/', async (req, res) => {
  let products = await productsManager.readFile()
  res.json(products)
})

router.get("/:id", (req, res) => {
  let { id } = req.params
  let producto = products.find(p => p.id === parseInt(id))
  if (producto) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json({ payload: producto })
  } else {
      return res.status(404).json({ error: 'Producto no encontrado' })
  }
})

router.post('/', async (req, res) => {
  let { name, price, quantity } = req.body
  let newProduct = await productsManager.addItem({ name, price, quantity: quantity || 1 })
  let io = req.app.get('socketio')
  let updatedProducts = await productsManager.readFile()
  io.emit('products', updatedProducts)
  res.status(201).json(newProduct)
})

router.put('/:id', async (req, res) => {
  let updatedProduct = await productsManager.updateItem(parseInt(req.params.id), req.body)
  if (updatedProduct) {
    let io = req.app.get('socketio')
    let updatedProducts = await productsManager.readFile()
    io.emit('products', updatedProducts)
    res.json(updatedProduct)
  } else {
    res.status(404).json({ message: 'Producto no encontrado' })
  }
})

router.delete('/:id', async (req, res) => {
  await productsManager.deleteItem(parseInt(req.params.id))
  let io = req.app.get('socketio')
  let updatedProducts = await productsManager.readFile()
  io.emit('products', updatedProducts)
  res.status(204).end()
})

export default router