import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'
import dotenv from 'dotenv'
dotenv.config()

initDatabase()

const post = new Post({
  title: 'Hello Mongoose!',
  author: 'Danny Boy',
  contents: 'This is my first post to Mongo DB',
  tags: ['mongoose', 'mongoDB'],
})

await post.save()

const posts = await Post.find()

console.log(posts)
