import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import { Post } from '../db/models/post.js'
import {
  createPost,
  listAllPosts,
  listByAuthor,
  listPostsByTags,
} from '../services/posts.js'

describe('creating post', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose Test',
      author: 'Danny boy',
      contents: 'This is a blog test.',
      tags: ['mongoose', 'mongodb'],
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    // Check for Post retreival
    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const post = {
      author: 'Daniel Bugl',
      contents: 'This is a post with no title.',
      tags: ['empty'],
    }
    try {
      await createPost(post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

const samplePosts = [
  { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    author: 'Daniel Bugl',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
]

let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing post', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by defaul', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  test('should take into acount provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listByAuthor('Daniel Bugl')
    expect(posts.length).toBe(3)
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTags('nodejs')
    expect(posts.length).toBe(1)
  })
})
