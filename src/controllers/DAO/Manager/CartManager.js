import fs from 'fs'
import { nanoid } from 'nanoid'
import ProductManager from './ProductManager.js'

const productToCart = new ProductManager()

export default class CartManager {
  addCart = async () => {
    const carts = JSON.parse(await fs.promises.readFile('./src/models/carts.json', 'utf-8'))
    const cart = {
      products: []
    }
    cart.id = nanoid()
    carts.push(cart)
    await fs.promises.writeFile('./src/models/carts.json', JSON.stringify(carts))
    return carts
  }
  findCartById = async (id) => {
    const idCarts = JSON.parse(await fs.promises.readFile('./src/models/carts.json', 'utf-8'))
    const filterCart = idCarts.find((cart) => cart.id === id)
    if(filterCart === undefined){
      let error = 'Cart Not Found'
      return error
    }
    return filterCart
  }
  #validateCart = async (id) => {
    let carts = JSON.parse(await fs.promises.readFile('./src/models/carts.json', 'utf-8'));
    return carts.find((cart) => cart.id === id);
  }

  #validateProduct = async (id) => {
    let products = await productToCart.getProducts();
    return await products.find((product) => product.id === id);
  }
  addProductToCart = async (cid, pid) => {
    let validateCart = await this.#validateCart(cid)
    let validateProd = await this.#validateProduct(pid)
    let err = 'Doesnt exist'
    if(validateCart === false){
      return err
    }
    if(validateProd === false){
      return err
    }
    const listCart = JSON.parse(await fs.promises.readFile('./src/models/carts.json', 'utf-8'))
    let filterCart = await listCart.filter((cart) => cart.id != cid)
    if(validateCart.products.some((product) => product.id === pid)){
      let prodExist = validateCart.products.find(
        (product) => product.id === id
      )
      prodExist.quantity++
      let newCart = [validateCart, ...filterCart]
      await fs.promises.writeFile('./src/models/carts.json', JSON.stringify(newCart))
      return 'added to cart'
    }
    validateCart.products.push({id:validateProd.id, quantity: 1})
    let newCart = [validateCart, ...filterCart]
    await fs.promises.writeFile('./src/models/carts.json', JSON.stringify(newCart))
    return 'added to cart'
  }
}
