import express from 'express'
import { auth, authAdmin } from '../middleware/auth.js'
import passport from 'passport'
import { ViewsController } from '../controller/viewsController.js'

const router = express.Router()

router.get('/', ViewsController.getProducts)

router.get('/register', ViewsController.register)

router.get('/login', ViewsController.login)

router.get("/perfil", auth,
  passport.authenticate("current", { session: false }),
  ViewsController.perfil
)

router.get("/realtimeproducts", authAdmin,
  ViewsController.realTimeProducts
)

router.get('/verUsuarios', authAdmin,
  ViewsController.verUsuarios
)

router.get('/carts', ViewsController.carts)

router.get('/carts/:cid', ViewsController.cartId)

router.get('/products', ViewsController.productsHome)

router.get("/products/:pid", ViewsController.productsId)

export default router