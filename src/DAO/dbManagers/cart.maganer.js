import { cartModel } from "../models/cart.model.js";
import productManager from "../dbManagers/product.manager.js";

class CartManager {
  constructor() {
    this.model = cartModel
  }
  async getCarts() {
    return await cartModel.find().lean()
  }
  async getCartById(cid) {
    return await cartModel.findById(cid)
  }
  async addCart(cart) {
    return await cartModel.create(cart);
  }
  async updateCart(cid, cart) {
    return await cartModel.findByIdAndUpdate(
      cid,
      { $set: cart },
      { new: true }
    )
  }
  async addProdtoCart(cid, pid) {
    try {
      let selectedCart = await this.getCartById(cid)
      let selectedProduct = await productManager.getProductById(pid)
      let existingProduct = selectedCart.products.find((prod) => {
        return prod.product.toString() === selectedProduct._id.toString();
      })
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        selectedCart.products.push({
          product: selectedProduct._id,
          quantity: 1,
        })
      }
      await this.updateCart(cid, selectedCart);
    } catch (err) {
      console.log(`Error: ${err}`)
    }
  }

  async deleteCartProduct(cid, pid) {
    try {
      await cartModel.updateOne(
        { _id: cid },
        { $pull: { products: { product: pid } } }
      );
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }
  async deleteAllProds(cid) {
    try {
      await cartModel.updateOne(
        { _id: cid },
        { $set: { products: [] } }
      );
    } catch (err) {
      console.log(`Error: ${err}`)
    }
  }

  async updateCartProduct(cid, pid, quantity) {
    try {
      await cartModel.updateOne(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity.quantity } }
      );
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }
}

const cartManager = new CartManager()

export default cartManager
