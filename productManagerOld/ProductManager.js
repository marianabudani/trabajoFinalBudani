class ProductManager {
  #id = 0
  constructor(){
    this.products = []
  }
  getProducts (){
    return this.products
  }
  addProduct(title, description, price, thumbnail, code, stock){
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log(`Error all fields are required`)
      return
    }
    let checkData = this.products.filter((e)=> e.code === code)
    if(checkData.length > 0){
      console.log(`Error ${code} alredy exist`)
      return
    }
    const product = {
      title, description, price, thumbnail, code, stock
    }
    product.id = this.#getId()
    this.products.push(product)
  }

  getProductById(id){
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    )
    if(productIndex === -1){
      console.log('Not found')
      return
    }
    const product = this.products[productIndex]
    return product
  }
  #getId(){
    this.#id++
    return this.#id
  }
}
const productManager = new ProductManager()

productManager.addProduct('prueba','test', 30, 'foto', 'A',10)
productManager.addProduct('prueba','test', 30, 'foto', 'B',10)
productManager.addProduct('prueba','test', 3, 'Foto', 'A',10)
console.log('-----------------------------------------')
console.log(productManager.getProductById(1))
console.log('-----------------------------------------')
console.log(productManager.getProductById(3))
console.log('-----------------------------------------')
console.log(productManager.getProducts())