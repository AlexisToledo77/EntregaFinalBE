import express from 'express'
import { engine } from 'express-handlebars'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import viewsRouter from './routes/viewsRouter.js'
import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'
import usersRouter from './routes/usersRouter.js'
import { productsManager } from './dao/productsManager.js'
import { userManager } from './dao/userManager.js'
import { cartsManager } from './dao/cartsManager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server)


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

  const products = await productsManager.readFile()
  socket.emit('products', products)

  socket.on('newProduct', async (product) => {
    const newProduct = await productsManager.addItem(product)
    const updatedProducts = await productsManager.readFile()
    io.emit('products', updatedProducts)
  })

  socket.on('deleteProduct', async (productId) => {
    await productsManager.deleteItem(productId)
    const updatedProducts = await productsManager.readFile()
    io.emit('products', updatedProducts)
  })

  socket.on('newUser', async (user) => {
    const newUser = await userManager.addItem(user)
    const updatedUser = await userManager.readFile()
    io.emit('user', updatedUser)
  })

  socket.on('deleteUser', async (user) => {
    await userManager.deleteItem(user)
    const deleteUser = await userManager.readFile()
    io.emit('user', deleteUser)
  })

  socket.on('newCart', async (cart) => {
    const newCart = await cartsManager.addItem(cart)
    const updatedCart = await cartsManager.readFile()
    io.emit('cart', updatedCart)
  })

  socket.on('deleteCarts', async (cart) => {
    await cartsManager.deleteItem(cart)
    const updatedCarts = await cartsManager.readFile()
    io.emit('cart', updatedCarts)
  })

})

app.set('socketio', io)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})