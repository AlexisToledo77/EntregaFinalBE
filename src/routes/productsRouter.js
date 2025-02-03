import express from 'express'
import { ProductsController } from '../controller/ProductsController.js'

const router = express.Router()

router.get('/', ProductsController.getProducts)

router.get('/:id', ProductsController.getProductsById)

router.post("/", ProductsController.createProducts)

router.put("/:id", ProductsController.updateProducts)

router.delete("/:id", ProductsController.deleteProducts)

export default router