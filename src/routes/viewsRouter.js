import express from 'express'
import { productsManager } from '../dao/productsManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const products = await productsManager.readFile()
  res.render('home', { products })
})


router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts')
})

export default router