import express from 'express'
import dotenv from 'dotenv'
import { postsRoutes } from './routes/posts.js'

dotenv.config()

const app = express()
postsRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express.')
})

export { app }
