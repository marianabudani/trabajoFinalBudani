import fs from 'fs'
import Joi from 'joi'

const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  code: Joi.string().required(),
  price: Joi.number().required(),
  status: Joi.boolean().required(),
  stock: Joi.number().required(),
  category: Joi.string().required(),
  thumbnails: Joi.array().items(Joi.string()),
})

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
  async addProduct(product) {
    try {
      if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        throw new Error('All fields except images are required')
      }

      if (product.status === undefined || product.status === null) {
        product.status = true
      }

      const productsList = await this.getProducts()

      const { error, value } = productSchema.validate(product, { abortEarly: false })
      if (error) {
        const errors = error.details.map((errorDetail) => errorDetail.message)
        console.log(`Error while validating product fields: ${errors.join(', ')}`)
        return
      }

      const productExists = productsList.find(p => p.code === product.code)
      if (productExists) {
        console.log(`Product with code ${product.code} already exists`)
        return
      }

      const newProduct = {
        id: this.#getId(),
        ...value
      }

      productsList.push(newProduct)
      await fs.promises.writeFile('./products.json', JSON.stringify(productsList))
      console.log(`Product with code ${product.code} added successfully`)
    } catch (error) {
      console.log(`Error while adding product: ${error}`)
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
  async updateProduct(productId, updatedFields) {
    try {
      // Obtener lista de productos
      const productsList = await this.getProducts()
  
      // Encontrar el producto a actualizar
      const productIndex = productsList.findIndex(p => p.id === productId)
      if (productIndex === -1) {
        console.log(`Product with id ${productId} not found`)
        return
      }
  
      // Actualizar los campos del producto
      const updatedProduct = {
        ...productsList[productIndex],
        ...updatedFields,
        id: productId 
      };
  
      // Validar los campos del producto actualizado
      const { error } = productSchema.validate(updatedProduct, { abortEarly: false })
      if (error) {
        const errors = error.details.map((errorDetail) => errorDetail.message)
        console.log(`Error while validating product fields: ${errors.join(', ')}`)
        return
      }
  
      // Reemplazar el producto antiguo con el nuevo en la lista de productos
      productsList[productIndex] = updatedProduct
  
      // Guardo
      await fs.promises.writeFile('./products.json', JSON.stringify(productsList))
      console.log(`Product with id ${productId} updated successfully`)
    } catch (error) {
      console.log(`Error while updating product: ${error}`)
    }
  }
  
  async deleteProduct(id) {
    try {
      if (typeof id !== 'string' || !id.trim() || !/^[a-zA-Z0-9_-]+$/.test(id)) {
        throw new Error(`Invalid product ID: ${id}`);
      }
      const productsList = await this.getProducts();
      const filteredList = productsList.filter(product => product.id !== id);
      if (filteredList.length === productsList.length) {
        throw new Error(`Product with ID ${id} not found`);
      }
      await fs.promises.writeFile('./products.json', JSON.stringify(filteredList));
      console.log(`Product with ID ${id} deleted`);
    } catch (error) {
      console.log(`Error while deleting product with ID ${id}: ${error}`);
      throw error;
    }
  }
  
}