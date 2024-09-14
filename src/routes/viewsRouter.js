import express from 'express'
import { ProductsManager } from '../dao/productsManager.js'
import { UserManager } from '../dao/userManager.js'

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

export default router