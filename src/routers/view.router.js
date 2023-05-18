import { Router } from 'express'
import ProductManager from '../../models/ProductManager.js'
const viewRouter = Router()
const productManager = new ProductManager()

viewRouter.get('/', (req, res) => {
  res.render('index')
})
viewRouter.get('/home', async (req, res) => {
  const products = await productManager.getProducts()
  console.log(products);
  res.render('home', { products })  
})
viewRouter.get('/realtimeproducts', async (req, res) => {
  const productsList = await productManager.getProducts()
  res.render('realTimeProducts', { productsList })
})
export default viewRouter