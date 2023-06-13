import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import { cartRouter } from './routers/cart.router.js'
import { productsRouter } from './routers/products.router.js'
import viewRouter from './routers/view.router.js'
import * as path from 'path'
import { app, io } from './util.js'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', 'views/')
app.set('view engine', 'handlebars')
app.use(express.static(path.join(process.cwd() + '/public')))
app.use('/api/cart', cartRouter)
app.use('/api/products', productsRouter)
app.use('/', viewRouter)

mongoose.connect('mongodb+srv://marianabudani:admin123@codercluster.bibtfvx.mongodb.net/?retryWrites=true&w=majority')

io.on("connection", async (socket) => {
  socket.on("message", async (data) => {
    io.emit("messageLogs")
  });
  socket.on("messageHi", async (data) => {
    io.emit("messageLogs")
    socket.broadcast.emit("alert", data)
  });
});
