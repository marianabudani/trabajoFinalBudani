import { promises } from 'fs'
import { nanoid } from 'nanoid'

export default class ProductManager {
  constructor() {
    this.products = []
    this.product = {
      id: 0,
      title: '',
      description: '',
      price: 0,
      code: '',
      stock: 0,
      category: ''
    }
  }
  async getProducts(){
    try {
      const productsList = await promises.readFile('./src/models/products.json', 'utf-8');
      return JSON.parse(productsList);
    } catch (error) {
      console.log(`Error products not found ${error}`)
    }
  }
  async addProduct(product) {
    try {
      if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        let productList = JSON.parse(await promises.readFile('./src/models/products.json', 'utf-8'))

        product.id = nanoid()
        this.product.title = product.title
        this.product.description = product.description
        this.product.price = product.price
        this.product.code = product.code
        this.product.stock = product.stock
        this.product.category = product.category

        const productFilter = productList.filter(prod => prod.code === product.code)

        if (productFilter.length > 0) {
            console.log('out of stock')
            return
        }
        const cart = [...productList, product]
        console.log(`product: ${product.title} added`);
        writeFileSync('./src/models/products.json', JSON.stringify(cart));

      } else (console.log('All fields are required'))
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
      await promises.writeFile('./products.json', JSON.stringify(productsList))
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
      await promises.writeFile('./products.json', JSON.stringify(filteredList));
      console.log(`Product with ID ${id} deleted`);
    } catch (error) {
      console.log(`Error while deleting product with ID ${id}: ${error}`);
      throw error;
    }
  }
  
}