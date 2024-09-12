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
import { ProductManager } from './dao/productsManager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = config.PORT

// MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err))

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
});

connDB()

// const io = new Server(httpServer);
// const productManager = new ProductManager();

// io.on('connection', (socket) => {
//     console.log('Nuevo cliente conectado');

//     socket.on('addProduct', async (product) => {
//         await productManager.addProduct(product);
//         io.emit('updateProducts', await productManager.getProducts());
//     });

//     socket.on('deleteProduct', async (id) => {
//         await productManager.deleteProduct(id);
//         io.emit('updateProducts', await productManager.getProducts());
//     });
// });

// export { io };