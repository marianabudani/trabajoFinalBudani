import { Router } from "express"

const products = []
const productsRouter = Router()

productsRouter.get('/', (req, res) => {
  res.send(products)
})

productsRouter.post('/', (req, res) => {
  const product = req.body
  products.push(product)
  res.status(201).send(product)
})

export { productsRouter }