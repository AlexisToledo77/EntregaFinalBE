import express from 'express'
import { engine } from 'express-handlebars'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import viewsRouter from './routes/viewsRouter.js'
import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'
import { router as usersRouter } from './routes/usersRouter.js'
import { productsManager } from './dao/productsManager.js'
import { userManager } from './dao/userManager.js'
import { cartsManager } from './dao/cartsManager.js'
import { config } from './config/config.js'
import { connDB} from "./connDB.js"

const PORT =config.PORT

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server)

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
})

connDB()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/users', usersRouter)


io.on('connection', async (socket) => {
  console.log('Cliente conectado')

  let products = await productsManager.readFile()
  socket.emit('products', products)

  socket.on('newProduct', async (product) => {
    let newProduct = await productsManager.addItem(product)
    let updatedProducts = await productsManager.readFile()
    io.emit('products', updatedProducts)
  })

  socket.on('deleteProduct', async (productId) => {
    await productsManager.deleteItem(productId)
    let updatedProducts = await productsManager.readFile()
    io.emit('products', updatedProducts)
  })

  socket.on('newUser', async (user) => {
    let newUser = await userManager.addItem(user)
    let updatedUser = await userManager.readFile()
    io.emit('user', updatedUser)
  })

  socket.on('deleteUser', async (user) => {
    await userManager.deleteItem(user)
    let deleteUser = await userManager.readFile()
    io.emit('user', deleteUser)
  })

  socket.on('newCart', async (cart) => {
    let newCart = await cartsManager.addItem(cart)
    let updatedCart = await cartsManager.readFile()
    io.emit('cart', updatedCart)
  })

  socket.on('deleteCarts', async (cart) => {
    await cartsManager.deleteItem(cart)
    let updatedCarts = await cartsManager.readFile()
    io.emit('cart', updatedCarts)
  })

})

app.set('socketio', io)

// const PORT = process.env.PORT || 3000
// server.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`)
// })