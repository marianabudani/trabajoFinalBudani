import fs from 'fs'

export default class CartManager {
  #id = 0
  
  constructor(productManager) {
    if (!fs.existsSync('./carts.json')) {
      fs.writeFileSync('./carts.json', JSON.stringify([]))
    }
    this.productManager = productManager
  }

  getNextId() {
    this.#id++;
    return this.#id;
  }

  async createCart() {
    const newCart = {
      id: this.getNextId(),
      products: []
    };

    const carts = await this.getCarts();
    carts.push(newCart);
    await this.saveCarts(carts);

    return newCart;
  }

  async getCart(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile('./carts.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`Error while getting carts: ${error}`);
      return [];
    }
  }

  async saveCarts(carts) {
    try {
      await fs.promises.writeFile('./carts.json', JSON.stringify(carts));
    } catch (error) {
      console.log(`Error while saving carts: ${error}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCart(cartId);
    if (!cart) {
      console.log(`Cart with id ${cartId} not found`);
      return;
    }

    const product = await this.productManager.getProduct(productId);
    if (!product) {
      console.log(`Product with id ${productId} not found`);
      return;
    }

    const existingProduct = cart.products.find(p => p.id === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity: quantity });
    }

    const carts = await this.getCarts();
    const updatedCarts = carts.map(c => {
      if (c.id === cart.id) {
        return cart;
      }
      return c;
    });
    await this.saveCarts(updatedCarts);

    return cart;
  }
}
