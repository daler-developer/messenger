import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import http from 'http'

import usersRouter from './routes/users.js'
import messagesRouter from './routes/messages.js'
import startSocket from './socket/index.js'


const __dirname = path.resolve()

const app = express()

const httpServer = http.createServer(app)

startSocket(httpServer)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/api/users', usersRouter)
app.use('/api/messages', messagesRouter)

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})



const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://dalersaidov:asdfwqer@cluster-for-learning.uecly.mongodb.net/messanger-mern?retryWrites=true&w=majority')
    
    httpServer.listen(process.env.PORT || 4000)
    console.log('listening')
  } catch (e) {
    console.log('db error', e)
  }
}

start()

export { httpServer }
