import express from 'express'
import { engine } from 'express-handlebars'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import viewsRouter from './routes/viewsRouter.js'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartsRouter.js'
import { router as usersRouter } from './routes/usersRouter.js'
import { config } from './config/config.js'
import { connDB} from "./connDB.js"
import exphbs from 'express-handlebars'
import { registerHelpers } from './hbs-helpers.js'


const PORT =config.PORT

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server)

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

const hbs = exphbs.create({})

registerHelpers(hbs.handlebars)

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', viewsRouter)
app.use('/api/products', 
  (req, res, next)=>{
    req.io=io
    next()
  },  
  productsRouter
)
app.use('/api/carts', 
  (req, res, next)=>{
    req.io=io
    next()
  },  
  cartRouter
)
app.use('/api/users', usersRouter)

connDB()

// io.on("connection", socket => {
//   socket.on("message", message => {
//       console.log(message);
//   })
// })

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product);
        io.emit('updateProducts', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        io.emit('updateProducts', await productManager.getProducts());
    });
});

export { io };





