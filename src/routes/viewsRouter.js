import express from 'express'
import { productsManager } from '../dao/productsManager.js'
import { userManager } from '../dao/userManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const products = await productsManager.readFile()
  res.render('home', { products })
})


router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts')
})

router.get('/verUsuarios', async (req, res) => {
  const user = await userManager.readFile()
  res.render('verUsuarios', { user })
})

router.get('/verUsuarios', (req, res) => {
  res.render('verUsuarios')
})

export default router