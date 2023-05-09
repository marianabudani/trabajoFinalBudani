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

productsRouter.get('/:pid', (req, res) => {
  const id = req.params.pid
  const filterId = await productManager.getProductsById(id)
  try{
    if(filterId != undefined){
      return res.send(filterId)
    }else{
      res.status(200).send(await filterId)
    }
  }catch(error){
    res.status(400).send(`400 ${error}`)
  }
})

export { productsRouter }