import express from 'express'
import { cartRouter } from './routers/cart.router.js'
import { productsRouter } from './routers/products.router.js'

const app = express()
const port = 8080

app.use('/static', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/cart', cartRouter)
app.use('/api/products', productsRouter)

app.listen(port, () => {
  console.log(`Server runnin in port ${port}`)
})