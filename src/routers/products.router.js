import { Router } from "express"
import ProductManager from "../controllers/DAO/Manager/ProductManager.js"

const productManager = new ProductManager()
const productsRouter = Router()

productsRouter.get('/', async(req, res) => {
  try {
    let limit = req.query.limit
    let products = await productManager.getProducts()
    if(limit){
      products = products.slice(0, limit)
    }
    res.send(products)
  } catch (error) {
    res.status(500).send(`Error getting the products ${error}`)
  }
})

productsRouter.post('/', async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((errorDetail) => errorDetail.message)
      console.log(`Error while validating product fields: ${errors.join(', ')}`)
      res.status(400).send(`Validation error: ${errors.join(', ')}`)
      return
    }
    const newProduct = {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      status: req.body.status,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails
    }
    await productManager.addProduct(newProduct)
    res.status(201).send(newProduct)
  } catch (error) {
    console.log(`Error while adding product: ${error}`)
    res.status(500).send('Internal server error')
  }
})

productsRouter.get('/:pid', async(req, res) => {
  const id = req.params.pid
  try {
    const product = await productManager.getProductById(id)
    if (!product) {
      res.status(404).send(`Product with ID ${id} not found`)
      return
    }
    res.send(product)
  } catch (error) {
    res.status(500).send(`Error while getting product with ID ${id}: ${error}`)
  }
})
productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;
    const productSearch = await productManager.getProductById(productId)
    if(!productSearch){
      res.status(404).send(`Product with ID ${id} not found`)
    }else {
      await productManager.updateProduct(productId, updatedFields)
      res.status(200).send(`Product with id ${productId} updated successfully`)
    }
  } catch (error) {
    console.log(`Error while updating product: ${error}`)
    res.status(500).send('Internal server error')
  }
})
productsRouter.delete('/:pid', async (req, res) => {
  const id = req.params.pid
  try {
    const product = await productManager.getProductById(id)
    if (!product) {
      res.status(404).send(`Product with ID ${id} not found`)
      return
    }
    await productManager.deleteProduct(id)
    res.status(200).send(`Product with ID ${id} deleted successfully`)
  } catch (error) {
    res.status(500).send(`Error while deleting product with ID ${id}: ${error}`)
  }
})

export { productsRouter }