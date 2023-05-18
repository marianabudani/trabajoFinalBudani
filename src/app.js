import express from 'express'
import { cartRouter } from './routers/cart.router.js'
import { productsRouter } from './routers/products.router.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewRouter from './routers/view.router.js'
import ProductManager from '../models/ProductManager.js'

const app = express()
const port = 8080

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', 'views/')
app.set('view engine', 'handlebars')

app.use('/api/cart', cartRouter)
app.use('/api/products', productsRouter)
app.use('/', viewRouter)

const webServer = app.listen(port, () => {
  console.log(`Server runnin in port ${port}`)
})

const io = new Server(webServer)
const productManager = new ProductManager()

io.on('connection', async (socket) => {
  console.log("New client")
  socket.emit("productList", await productManager.getProducts())
  socket.on("newProduct", async (product) => {
    await productManager.addProduct(product)
    socket.emit("productList", await productManager.getProducts())
  })
  socket.on("eraseProduct", async(id) => {
    await productManager.deleteProduct(id)
    socket.emit("productList", await productManager.getProducts())
  })
})
