import { ProductsDAO } from "../dao/productsDAO.js"
import { procesaErrores } from "../utils.js"
import { isValidObjectId } from 'mongoose'

export class ProductsController {
    static async getProducts(req, res) {
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
    
            let result = await ProductsDAO.paginate(filter, options)
            
    
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
    }

    static async getProductsById (req, res) {
    
        let pid = req.params.id
    
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `id formato inválido` })
        }
    
        try {
            let products = await ProductsDAO.getProductsBy({ _id: pid })
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
    }

    static async createProducts (req, res) {
        const newProduct = req.body
        const result = await ProductsDAO.createProducts(newProduct)
        const products = await ProductsDAO.getProducts()
        req.io.emit('updateProducts', products.payload)
        res.json(result)
    }

    static async updateProducts (req, res) {
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
            let productModificado = await ProductsDAO.update(id, aModificar)
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
    }

    static async deleteProducts (req, res) {
        let { id } = req.params
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `ID invalido` })
        }
    
        try {
            let productEliminado = await ProductsDAO.deleteProducts(id)
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
    }





}
