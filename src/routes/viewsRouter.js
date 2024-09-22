import express from 'express'
import { ProductsManager } from '../dao/productsManager.js'
import { UserManager } from '../dao/userManager.js'
import { CartManager } from '../dao/cartsManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
  let products = await ProductsManager.getProducts()
  res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
  let products = await ProductsManager.getProducts()
  res.render('realTimeProducts', { products })
})

router.get('/verUsuarios', async (req, res) => {
  let users = await UserManager.getUsers()
  res.render('verUsuarios', { users })
})

router.get('/carts', async (req, res) => {
  const cid = "66e8ffe277186cd85d69378d";
  let cart = await CartManager.getCartById(cid)
  res.render('cart', { cart })
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