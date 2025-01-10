import express from 'express'
import { ProductsManager } from '../dao/productsManager.js'
import { isValidObjectId } from 'mongoose'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query
        let options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true
        };

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 }
        }

        const filter = {}
        if (query) {
            filter.$or = [
                { category: { $regex: query, $options: 'i' } },
                { status: query.toLowerCase() === 'true' }
            ];
        }

        let result = await ProductsManager.paginate(filter, options)

        let baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`


        res.render('products', {
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            prevLink: result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        console.log(error)
        res.status(500).render('error', {
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
})

router.get('/:id', async (req, res) => {

    let pid = req.params.id

    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `id formato inválido` })
    }

    try {
        let products = await ProductsManager.getProductsBy({ _id: pid })
        if (!products) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `No existen usuarios con id ${id}` })
        }
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

router.post("/", async (req, res) => {
    const newProduct = req.body
    const result = await ProductsManager.createProducts(newProduct)
    const products = await ProductsManager.getProducts()
    req.io.emit('updateProducts', products.payload)
    res.json(result)
})

router.put("/:id", async (req, res) => {
    let { id } = req.params
    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `ID invalido` })
    }
    let { ...aModificar } = req.body
    let cantPropsModificar = Object.keys(aModificar).length
    if (cantPropsModificar === 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No se han ingresado propiedades para modificar` })
    }

    try {
        let productModificado = await ProductsManager.update(id, aModificar)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productModificado });
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

router.delete("/:id", async (req, res) => {
    let { id } = req.params
    if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `ID invalido` })
    }

    try {
        let productEliminado = await ProductsManager.deleteProducts(id)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ productEliminado })
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})

export default router