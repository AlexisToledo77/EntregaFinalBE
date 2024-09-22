// import express from 'express'
// import { engine } from 'express-handlebars'
// import { createServer } from 'http'
// import { Server } from 'socket.io'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import viewsRouter from './routes/viewsRouter.js'
// import productsRouter from './routes/productsRouter.js'
// import cartRouter from './routes/cartsRouter.js'
// import { router as usersRouter } from './routes/usersRouter.js'
// import { config } from './config/config.js'
// import { connDB} from "./connDB.js"
// import exphbs from 'express-handlebars'
// import { registerHelpers } from './hbs-helpers.js'

// const PORT =config.PORT

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const app = express()
// const server = createServer(app)
// const io = new Server(server)

// const httpServer = app.listen(PORT, () => {
//   console.log(`Servidor corriendo en puerto ${PORT}`)
// })

// const hbs = exphbs.create({})

// registerHelpers(hbs.handlebars)

// app.engine('handlebars', hbs.engine)
// app.set('view engine', 'handlebars')
// app.set('views', path.join(__dirname, 'views'))

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// app.use('/', viewsRouter)
// app.use('/api/products', productsRouter)
// app.use('/api/carts', cartRouter)
// app.use('/api/users', usersRouter)

// io.on('connection', (socket) => {
//   console.log('Nuevo cliente conectado');

//   socket.on('addProduct', async (productData) => {
//       try {
//           const newProduct = await Product.create(productData);
//           io.emit('productAdded', newProduct);
//       } catch (error) {
//           console.error('Error al agregar producto:', error);
//       }
//   });
// });

// connDB()

import express from 'express';
import exphbs from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connDB } from './connDB.js';
import { config } from './config/config.js';
import { router as usersRouter } from "./routes/usersRouter.js"
import viewsRouter from './routes/viewsRouter.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import { ProductsManager } from './dao/productsManager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = config.PORT

// Handlebars
const hbs = exphbs.create({
  helpers: {
    multiply: (a, b) => (a * b).toFixed(2),
    calculateTotal: (products) => products.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
  }
})

app.engine('handlebars', exphbs.engine())
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Rutas
app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use("/api/users", usersRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
})

connDB()

const io = new Server(httpServer);

const productsManager  = new ProductsManager ();

io.on('connection', (socket) => {
   console.log('Nuevo cliente conectado');

     socket.on('addProduct', async (product) => {
         await productManager.addProduct(product);
         io.emit('updateProducts', await productsManager.getProducts());
     });

     socket.on('deleteProduct', async (id) => {
         await productManager.deleteProduct(id);
         io.emit('updateProducts', await productsManager.getProducts());
     });
 });

 export { io };




