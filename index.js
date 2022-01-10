import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'

import postsRouter from './routes/posts.js'
import usersRouter from './routes/users.js'


const __dirname = path.resolve()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)


const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://dalersaidov:2000909k@cluster-for-learning.uecly.mongodb.net/instagram-clone-mern?retryWrites=true&w=majority')
    
    app.listen(4000)
    console.log('listening')
  } catch (e) {
    console.log('db error', e)
  }
}

start()
