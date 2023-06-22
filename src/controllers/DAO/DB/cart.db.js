import { cartModel } from '../../models/carts.model.js';
import { productList } from '../../../utils/instances.js';
import userModel from '../../models/product.model.js';


export default class cartManagers {

  constructor() {
    this.model = cartModel
    this.menssage = menssagerModel
    this.product = userModel
  }

  async addCart() {
    try {
      const cart = await this.model.create({ products: [] });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    const aggProduct = await this.model.find();
    console.log(aggProduct) 
    return aggProduct
  }

  async addProductCart(cid, pid) {

      const cart = await this.model.findOne({ _id: cid });
      const product = await productList.getProductsById(pid);

      const index = cart.products.findIndex((producto) => {
          return producto.product.toString() === pid;
      })

      if (index === -1) {
          cart.products.push({ product: pid, quantity: 1 })
      } else {
          cart.products[index].quantity += 1;
      }


      return await cart.save()

  }

  async getMenssage() {
      return console.log(await this.menssage.find())
  }

  async deleteProductCart(cid, pid) {

      const cart = await this.model.findOne({ _id: cid });

      const updeteProdct = cart.products.filter(product => product._id != pid)
      console.log(updeteProdct)
      cart.products.splice(updeteProdct, 1)


      return await cart.save();
  }


  async updateCart(cid, newProducts) {

      const cart = await this.model.findOne({ _id: cid });
      if (!cart) {
          throw new Error("cart not found");
      }

      cart.products = newProducts.products;

      
      await cart.save();

      return cart;

  }

  async updateQuantityProduct(cid, pid, qty) {
      try {
        const cart = await this.model.findOne({ _id: cid });
    
        const product = cart.products.find((product) => product._id == pid);
        if (!product) {
          throw new Error('product not found');
        }
    
        product.quantity = qty;
    
        await cart.save();
        return cart;
      } catch (err) {
        console.log('update error', err);
      }
    }

    async clearProductToCart(cid){
          
      const cart = await this.model.findOne({ _id: cid });
      cart.products = []
      return await cart.save();

    }


}