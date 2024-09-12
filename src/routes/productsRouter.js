import express from 'express';
import { ProductManager } from '../dao/productsManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const result = await productManager.getProducts(limit, page, sort, query);

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProduct(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        }
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

export default router;