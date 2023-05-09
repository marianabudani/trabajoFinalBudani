import { Router } from "express"

const cart = []
const cartRouter = Router()

cartRouter.get('/', (req, res) => {
  res.send(cart)
})

cartRouter.post('/', (req, res) => {
  const shop = req.body
  cart.push(shop)
  res.status(201).send(shop)
})

export { cartRouter }