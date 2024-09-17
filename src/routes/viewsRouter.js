import express from 'express'
import { ProductsManager } from '../dao/productsManager.js'
import { UserManager } from '../dao/userManager.js'
import { CartManager } from '../dao/cartsManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
  let products = await ProductsManager.getProducts()
  res.render('home', { products })
})

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts')
})

router.get('/verUsuarios', async (req, res) => {
  let users = await UserManager.getUsers()
  res.render('verUsuarios', { users })
})

router.get('/carts', async (req, res) => {
  let carts = await CartManager.getCart()
  res.render('cart', { carts })
})

router.get('/carts/:cid', async (req, res) => {
try {
  let cid = req.params.cid;
  let cart = await CartManager.getCartById(cid)
  if (cart) {
      res.render("cart", { cart })
  } else {
      res.status(404).json({ status: "error", error: "Producto no encontrado" })
  }
} catch (error) {
  res.status(500).json({ status: "error", error: error.message })
}
})

router.get('/products', async (req, res) => {
  let products = await ProductsManager.getProducts()
  res.render('products', { products })
})

router.get("/products/:pid", async (req, res) => {
  try {
      let pid = req.params.cid
      let product = await ProductsManager.getProductsBy(pid)
      if (product) {
          res.render("productDetail", { product })
      } else {
          res.status(404).json({ status: "error", error: "Producto no encontrado" })
      }
  } catch (error) {
      res.status(500).json({ status: "error", error: error.message })
  }
})

export default router