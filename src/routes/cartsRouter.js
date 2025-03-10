import express from 'express'
import { CartsController } from "../controller/CartsController.js"
import { authUser } from '../middleware/auth.js'
import passport from 'passport'

const router = express.Router()

router.get('/', CartsController.getCarts)

router.get('/purchase/:cid',
    passport.authenticate("current", { session: false }),
    CartsController.purchaseCart
)

router.get('/:id', CartsController.getCartsById)

router.post('/', CartsController.create)

router.post('/:cid/product/:pid', authUser, CartsController.addProductToCart)

router.put('/:cid', authUser, CartsController.update)

router.put('/:cid/product/:pid', authUser, CartsController.updateQuantity)

router.delete('/:cid/product/:pid', authUser, CartsController.deleteProductInCar)

router.delete("/:cid/products/", authUser, CartsController.clearCart)

router.delete('/:cid', CartsController.deleteCart)

export default router