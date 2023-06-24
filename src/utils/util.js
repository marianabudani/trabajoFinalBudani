import { Server } from 'socket.io'
import express from 'express'

const app = express()
const port = 8080

const httpServer = app.listen(port, () => {
  console.log(`Server up in http://localhost:${port}`)
})
const io = new Server(httpServer)

export { app, io }