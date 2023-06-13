import { Router } from 'express'
import cartManager from '../DAO/dbManagers/cart.maganer.js'

const cartRouter = Router()

cartRouter.get("/", async (req, res) => {
  try {
    res.status(200).send(await cartManager.getCarts());
  } catch (err) {
    res.status(400).send(err);
  }
})
cartRouter.get('/:cid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid)
    const cart = await cartManager.getCart(cid)
    if (!cart) {
      return res.status(404).json({ message: `Cart with id ${cid} not found` })
    }
    return res.json(cart.products)
  } catch (error) {
    console.log(`Error while getting products from cart: ${error}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

cartRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart()
    res.status(201).json(newCart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = Number(req.params.cid)
  const pid = Number(req.params.pid)
  const quantity = Number(req.body.quantity || 1)

  if (!cid || !pid) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }

  const cart = await cartManager.getCart(cid)
  if (!cart) {
    return res.status(404).json({ error: `Cart with id ${cid} not found` })
  }

  const addedProduct = await cartManager.addProductToCart(cid, pid, quantity)
  if (!addedProduct) {
    return res.status(404).json({ error: `Product with id ${pid} not found` })
  }

  res.json(addedProduct)
})
cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    res.status(201).send(await cartManager.deleteCartProduct(req.params.cid, req.params.pid))
  } catch (err) {
    res.status(404).json({ error: `Product with id ${pid} not found` })
  }
})

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    res.status(201).send(await cartManager.updateCartProduct(req.params.cid, req.params.pid, req.body))
  } catch (err) {
    res.status(404).json({ error: `Product with id ${pid} not found` })
  }
})

export { cartRouter }
