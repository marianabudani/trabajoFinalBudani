import { Router } from 'express'
import fs from 'fs'

const CARTS_FILE_PATH = './carts.json'
let carts = []
let cartIdCounter = 1

if(!fs.existsSync('./carts.json')){
  fs.writeFileSync('./carts.json', JSON.stringify([]))
}
// Lee el archivo carts.json al iniciar la aplicación
fs.readFile(CARTS_FILE_PATH, (err, data) => {
  if (err) {
    console.error(`Error while reading ${CARTS_FILE_PATH}: ${err}`)
    return
  }
  try {
    carts = JSON.parse(data)
    console.log(`Loaded ${carts.length} carts from ${CARTS_FILE_PATH}`)
  } catch (err) {
    console.error(`Error while parsing ${CARTS_FILE_PATH}: ${err}`)
  }
})

const saveCartsToFile = () => {
  // Escribe los carritos en el archivo carts.json
  fs.writeFile(CARTS_FILE_PATH, JSON.stringify(carts), (err) => {
    if (err) {
      console.error(`Error while writing ${CARTS_FILE_PATH}: ${err}`)
      return
    }
    console.log(`Saved ${carts.length} carts to ${CARTS_FILE_PATH}`)
  })
}

const cartRouter = Router()

cartRouter.get('/:cid', (req, res) => {
  const id = parseInt(req.params.cid);
  const cart = carts.find(c => c.id === id);
  if (!cart) {
    res.status(404).send(`Cart with ID ${id} not found`);
  } else {
    res.send(cart);
  }
})

cartRouter.post('/', (req, res) => {
  try {
    const newCart = {
      id: cartIdCounter++,
      products: []
    }
    carts.push(newCart)
    saveCartsToFile() // Guarda los cambios en el archivo carts.json
    res.status(201).send(newCart)
  } catch (error) {
    console.log(`Error while creating cart: ${error}`)
    res.status(500).send('Internal server error')
  }
})

cartRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = Number(req.params.cid)
  const productId = Number(req.params.pid)
  // Busco el carrito
  const cart = carts.find(c => c.id === cartId)
  // Si no se encontró, error
  if (!cart) {
    return res.status(404).send(`Cart with id ${cartId} not found`)
  }
  // Busco el producto
  const productIndex = cart.products.findIndex(p => p.product === productId)
  // Si el producto no existe, lo agrego
  if (productIndex === -1) {
    cart.products.push({ product: productId, quantity: 1 })
  } else {
    // Si el producto ya existe, incrementa su cantidad
    cart.products[productIndex].quantity++
  }
  saveCartsToFile() // Guarda los cambios en el archivo carts.json
  return res.status(200).send(`Product ${productId} updated in cart ${cartId}`)
})

export { cartRouter }
