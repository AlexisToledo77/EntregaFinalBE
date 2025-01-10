import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import viewsRouter from './routes/viewsRouter.js'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartsRouter.js'
import { router as usersRouter } from './routes/usersRouter.js'
import { config } from './config/config.js'
import { connDB } from "./connDB.js"
import exphbs from 'express-handlebars'
import { registerHelpers } from './hbs-helpers.js'
import { router as sessionsRouter } from "./routes/sessionsRouter.js"
import { inciarPassport } from './config/passport.config.js'
import passport from 'passport'
import cookieParser from "cookie-parser"

const PORT = config.PORT

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
const io = new Server(httpServer)

app.use((req, res, next) => {
  req.io = io
  next()
})

const hbs = exphbs.create({})

registerHelpers(hbs.handlebars)

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '/views'))

//PASSPORT
inciarPassport()
app.use(passport.initialize())

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ status: 'error1', message: err.message })
});

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users', usersRouter)
app.use("/api/sessions", sessionsRouter)

io.on('connection', socket => {
  console.log("New client connected")
  socket.on('productList', data => {
    io.emit('updateProducts', data.payload)
  })
})

connDB()




