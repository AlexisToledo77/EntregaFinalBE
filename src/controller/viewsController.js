import { ProductsDAO } from '../dao/productsDAO.js'
import { UserDAO } from '../dao/userDAO.js'
import { CartsDAO } from '../dao/cartsDAO.js'


export class ViewsController {

//revisar si son async
    static async getProducts (req, res) {
        let products = await ProductsDAO.getProducts()
        res.render('home', { products })
      }
 //revisar si son async
      static register (req, res) {
        let { mensaje } = req.query
        res.status(200).render('register',
          { mensaje })
      }

      static login (req, res) {
        let { mensaje } = req.query
        res.status(200).render('login',
          { mensaje })
      }

      static perfil (req, res) {
          console.log(req.user)
          res.status(200).render('perfil',
            {
              mensaje: "perfil usuario",
              datosUsuario: req.user
            })
        }

      static async realTimeProducts (req, res) {
        let allProducts = await ProductsDAO.getProducts()
        res.render("realTimeProducts", {
          title: "Productos RealTime",
          products: allProducts
        })
      }

      static async verUsuarios (req, res) {
        let users = await UserDAO.getUsers()
        res.render('verUsuarios', { users })
      }

      static async carts (req, res) {
        let carts = await CartsDAO.getCart()
        res.render('cart', { carts })
      }

      static async cartId (req, res) {
        try {
          let cid = req.params.cid;
          let cart = await CartsDAO.getCartById(cid)
          if (cart) {
            res.render("cart", { cart })
          } else {
            res.status(404).json({ status: "error", error: "Producto no encontrado" })
          }
        } catch (error) {
          res.status(500).json({ status: "error", error: error.message })
        }
      }
      
      static async productsHome (req, res) {
        try {
          let { limit = 10, page = 1, sort, query } = req.query
          limit = parseInt(limit)
          page = parseInt(page)
      
          let options = {
            limit,
            page,
            lean: true
          }
      
          if (sort && (sort === 'asc' || sort === 'desc')) {
            options.sort = { price: sort === 'asc' ? 1 : -1 }
          }
      
          const filter = {};
          if (query && query !== 'undefined') {
            filter.$or = [
              { category: { $regex: query, $options: 'i' } },
              { status: query.toLowerCase() === 'true' }
            ]
          }
      
          console.log('Filter:', filter)
          console.log('Options:', options)
      
          let result = await ProductsDAO.paginate(filter, options)
      
          console.log('Productos obtenidos:', result.docs)
          console.log('Total de documentos:', result.totalDocs)
          console.log('Límite:', result.limit)
          console.log('Página actual:', result.page)
          console.log('Total de páginas:', result.totalPages)
      
          let baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}/products`
      
          res.render('products', {
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            prevLink: result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
          })
        } catch (error) {
          console.error('Error al obtener productos:', error)
          res.status(500).render('error', {
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
          })
        }
      }

      static async productsId (req, res) {
        try {
          let pid = req.params.pid
          let product = await ProductsDAO.getProductsById(pid)
          if (product) {
            res.render("productDetail", { product })
          } else {
            res.status(404).json({ status: "error", error: "Producto no encontrado" })
          }
        } catch (error) {
          res.status(500).json({ status: "error", error: error.message })
        }
      }
}