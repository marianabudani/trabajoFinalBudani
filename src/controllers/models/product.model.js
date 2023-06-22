import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title: String,
    descripcion: String,
    price: Number,
    code: {
      type: String,
      unique: true,
    },
    stock: Number,
    category: String
})
const productModel = mongoose.model('products', productSchema)

export default productModel