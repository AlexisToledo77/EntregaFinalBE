import express from 'express'
import { CartsManager } from '../dao/cartsManager.js'


const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const carts = await CartsManager.getCart()
        res.status(200).json({ status: 'success', payload: carts })
      } catch(err) {
        res.status(404).json({ status: 'error', error: err.message })
      }
    }
)

router.post('/', async (req, res) => {
    try {
        await CartsManager.createCart()
        res.status(200).json({ status: 'success', mesagge: 'Cart created successfully' })
      } catch(err) {
        res.status(404).json({ status: 'No se puede crear Carrito', error: err.message })
      }
    }
)

router.post('/:cid/product/:pid', async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    try {
      const cart = await CartsManager.addProductInCart()

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() == productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      await cartModel.updateOne({_id: cartId}, cart)

      res.status(200).json({ status: 'success', payload: cart})
    } catch(err) {
      res.status(404).json({ status: 'error', error: err.message })
    }
  }
)



// router.post('/', async (req, res) => {
//   let { mail, product, quantity } = req.body
//   let newCart = await CartsManager.addItem({ mail, product, quantity })
//   let io = req.app.get('socketio')
//   let updatedCart = await CartsManager.readFile()
//   io.emit('cart', updatedCart)
//   res.status(201).json(newCart)
// })

router.get('/:id', async (req, res) => {
  let cart = await CartsManager.getItemById(parseInt(req.params.id))
  if (cart) {
    res.json(cart)
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' })
  }
})
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const result = await cartManager.addProductInCart(cid, { product: pid, quantity: quantity || 1 });
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})


export default router