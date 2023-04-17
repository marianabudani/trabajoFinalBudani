class ProductManager {
 // title, description, price, thumbnail, code, stock
 // e products (array vacio)
 //met addProduct - validar que no se repita el code, todos los compos obligatorios
 // getprod para ver los productos
 // getprodbyid ver 1 prod especifico (de no haber Item not found)
 static id = 0
constructor(title, description, price, thumbnail, code, stock){
  this.title = title
  this.description = description
  this.price = price
  this.thumbnail = thumbnail
  this.code = code
  this.stock = stock
  this.products = []
}
addProduct(product){
  
  this.products.forEach((e)=>{
    const code = Object.code(e)
    code.forEach((code)=>{
      if(!this.products.includes(code)){
        console.log(`Error ${code} alredy exist`)
        return 'Error'
      }else{
        this.products += product
        
        return 'Success'
      }
    })
  }) 
  ProductManager.id += 1
}
getProducts (){
  return this.products
}
getProductById(){

}
}