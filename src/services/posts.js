import { Post } from '../db/models/post.js'

export const createPost = async ({ title, author, contents, tags }) => {
  const post = new Post({ title, author, contents, tags })
  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listByAuthor(author, options) {
  return await listPosts({ author }, options)
}

export async function listPostsByTags(tags, options) {
  return await listPosts({ tags }, options)
}
