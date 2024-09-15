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

        let response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
        }

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({
            status: 'error',
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        })
    }
})


router.get('/:id',async(req,res)=>{

    let {id}=req.params
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:`id formato inválido`})
    }
  
    try {
        let products=await ProductsManager.getProductsBy({_id:id})
        if(!products){
            res.setHeader('Content-Type','application/json')
            return res.status(400).json({error:`No existen usuarios con id ${id}`})
        }
        res.setHeader('Content-Type','application/json')
        return res.status(200).json({products});
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json')
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }
})

  router.post("/", async(req, res)=>{
    let {title, description, ...otros}=req.body
    if(!title){
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:`Complete nombre del producto`})
    }

    try {
        let products=await ProductsManager.getProducts()
        let existe=products.find(p=>p.title===title)
        if(existe){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ya existe ${title} en la BD`})
        }        

        let newProduct=await ProductsManager.createProducts({title, description, ...otros})
        res.setHeader('Content-Type','application/json')
        return res.status(201).json({newProduct})
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json')
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }
})

router.put("/:id", async(req, res)=>{
    let{id}=req.params
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`ID invalido`})
    }
    let {...aModificar}=req.body
    let cantPropsModificar=Object.keys(aModificar).length
    if(cantPropsModificar===0){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`No se han ingresado propiedades para modificar`})
    }

    try {
        let productModificado=await ProductsManager.update(id, aModificar)  
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({productModificado});      
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }
})

router.delete("/:id", async(req, res)=>{
    let{id}=req.params
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:`ID invalido`})
    }

    try {
        let productEliminado=await ProductsManager.delete(id)  
        res.setHeader('Content-Type','application/json')
        return res.status(200).json({productEliminado})    
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json')
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }
})

export default router