import express from 'express'
import { ProductsManager } from '../dao/productsManager.js'
import { UserManager } from '../dao/userManager.js'
import { CartManager } from '../dao/cartsManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
  let products = await ProductsManager.getProducts()
  res.render('home', { products })
})

router.get("/realtimeproducts", async(req, res) => {
  let allProducts = await ProductsManager.getProducts()
  res.render("realTimeProducts", {
    title: "Productos RealTime",
    products: allProducts
  })
})

router.get('/verUsuarios', async (req, res) => {
  let users = await UserManager.getUsers()
  res.render('verUsuarios', { users })
})

router.get('/carts', async (req, res) => {
  let carts = await CartManager.getCart()
  res.render('cart', { carts })
})

router.get('/carts/:cid', async (req, res) => {
try {
  let cid = req.params.cid;
  let cart = await CartManager.getCartById(cid)
  if (cart) {
      res.render("cart", { cart })
  } else {
      res.status(404).json({ status: "error", error: "Producto no encontrado" })
  }
} catch (error) {
  res.status(500).json({ status: "error", error: error.message })
}
})

router.get('/products', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query
    limit = parseInt(limit);
    page = parseInt(page);
    
    let options = {
      limit,
      page,
      lean: true
    };

    if (sort && (sort === 'asc' || sort === 'desc')) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    const filter = {};
    if (query && query !== 'undefined') {
      filter.$or = [
        { category: { $regex: query, $options: 'i' } },
        { status: query.toLowerCase() === 'true' }
      ];
    }

    console.log('Filter:', filter);
    console.log('Options:', options);

    let result = await ProductsManager.paginate(filter, options);

    console.log('Productos obtenidos:', result.docs);
    console.log('Total de documentos:', result.totalDocs);
    console.log('Límite:', result.limit);
    console.log('Página actual:', result.page);
    console.log('Total de páginas:', result.totalPages);

    let baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}/products`;

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
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).render('error', {
      error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
      detalle: error.message
    });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
      let pid = req.params.pid
      let product = await ProductsManager.getProductsById(pid)
      if (product) {
          res.render("productDetail", { product })
      } else {
          res.status(404).json({ status: "error", error: "Producto no encontrado" })
      }
  } catch (error) {
      res.status(500).json({ status: "error", error: error.message })
  }
})

export default router