import fs from 'fs'

export default class ProductManager {
  #id = 0
  constructor() {
    if(!fs.existsSync('./products.json')){
      fs.writeFileSync('./products.json', JSON.stringify([]))
    }
  }
  #getId(){
    this.#id++
    return this.#id
  }
  async getProducts(){
    try {
      const products = await fs.promises.readFile('./products.json','utf-8')
      const productsList = JSON.parse(products)
      if (productsList.length > 0) {
        this.#id = Math.max(...productsList.map(p => p.id))
      }
      //console.log(productsList);
      return productsList
    } catch (error) {
      console.log(`Error products not found ${error}`)
    }
  }
  async addProduct(product){
    try {
      const productsList = await this.getProducts()
      product.id = this.#getId()
      productsList.push(product)
      await fs.promises.writeFile('./products.json',JSON.stringify(productsList))
    } catch (error) {
      console.log(`Error while add product ${error}`)
    }
  }
  async getProductById(id){
    try {
      const productsList = await this.getProducts()
      const product = productsList.find(p => p.id == id)
      if(!product){
        console.log(`Product with id ${id} not found`);
        return
      }
      //console.log(JSON.stringify(product));
      return product 
    } catch (error) {
      console.log(`Error while get product by id ${id}`);
    }
  }
  async updateProduct(id, updates){
    try {
      const productsList = await this.getProducts()
      const productIndex = productsList.findIndex((p) => p.id === id)
      if(productIndex === -1){
        console.log(`Product with id ${id} not found`);
        return
      }
      const updatedProduct = {...productsList[productIndex], ...updates}
      productsList[productIndex] = updatedProduct
      await fs.promises.writeFile('./products.json', JSON.stringify(productsList))
      console.log(`Product with id ${id} updated successfully`);
    } catch (error) {
      console.log(`Error while get product by id ${id}`);
    }
  }
  async deleteProduct(id) {
    try {
      const productsList = await this.getProducts()
      const filteredList = productsList.filter(product => product.id !== id)
      if (filteredList.length === productsList.length) {
        console.log(`Product with ID ${id} not found`)
        return
      }
      await fs.promises.writeFile('./products.json', JSON.stringify(filteredList))
      console.log(`Product with ID ${id} deleted`)
    } catch (error) {
      console.log(`Error while deleting product with ID ${id}: ${error}`)
    }
  }
}