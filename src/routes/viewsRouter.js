import express from 'express';
import { ProductManager } from '../dao/productsManager.js';
import { CartManager } from '../dao/cartsManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query } = req.query;
        const result = await productManager.getProducts(limit, page, sort, query);
        res.render('products', { 
            products: result.docs,
            pagination: {
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
                nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
            }
        });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render('error', { error: 'Producto no encontrado' });
        }
        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).render('error', { error: 'Carrito no encontrado' });
        }
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;