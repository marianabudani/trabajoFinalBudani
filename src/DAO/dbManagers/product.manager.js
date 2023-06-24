import { productModel } from "../models/product.model.js";

class ProductManager {
  constructor() {
    this.model = productModel
  }

  async getProducts(limit, page, sort, query) {
    const options = {
      limit: limit || 10,
      page: page || 1,
      lean: true,
    }
    if (sort) {
      options.sort = sort
    }
    return await this.model.paginate(query || {}, options)
  }
  async getProductById(pid) {
    return await productModel.findById(pid).lean()
  }
  async addProduct(product) {
    return await productModel.create(product)
  }
  async updateProduct(pid, product) {
    return await productModel.findByIdAndUpdate(
      pid,
      { $set: product },
      { new: true }
    );
  }
  async deleteProduct(pid) {
    return await productModel.findByIdAndDelete(pid)
  }
}
const productManager = new ProductManager()

export default productManager
