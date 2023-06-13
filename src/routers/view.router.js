import { Router } from 'express'
import productManager from '../DAO/dbManagers/product.manager.js'

const viewRouter = Router()

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
viewRouter.get("/products", async (req, res) => {
  let page = parseInt(req.query.page)
  if (!page) page = 1
  let result = await productManager.getProducts()
  console.log(result)
  result.prevLink = result.hasPrevPage
    ? `http://localhost:8080/products?page=${result.prevPage}`
    : "";
  result.nextLink = result.hasNextPage
    ? `http://localhost:8080/products?page=${result.nextPage}`
    : "";
  result.isValid = !(page <= 0 || page > result.totalPages)
  res.render("products",  result )
})
export default viewRouter