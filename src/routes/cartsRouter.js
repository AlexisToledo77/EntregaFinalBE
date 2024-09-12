import express from 'express';
import { CartManager } from '../dao/cartsManager.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid, quantity);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.updateCart(req.params.cid, req.body.products);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.clearCart(req.params.cid);
        res.json({ status: 'success', message: 'Todos los productos han sido eliminados del carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

export default router;