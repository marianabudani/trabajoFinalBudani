import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const port = 8080
const productManager = new ProductManager()

app.use(express.urlencoded({ extended: true }))

app.get('/products', async(req, res) => {
  try {
    let limit = req.query.limit
    let products = await productManager.getProducts()
    if (limit){
      products = products.slice(0, limit)
    }
    res.send(products)
  } catch (error) {
    res.send(error)
  }
})
app.get('/products/:pid', async(req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid)
    if(!product) {
      return res.status(404).send({error: 'Not found'})
    }
    res.send(product) 
  } catch (error) {
    res.send(error)
  }
})

app.get('/', (req, res) => {
  res.send('Hola')
})
app.listen(port, () => {
  console.log(`Server runnin in port ${port}`)
})