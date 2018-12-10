const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', {username: 1, name: 1})
    response.json(blogs.map(Blog.format))
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  try {

    const token = getTokenFrom(request)
    if (!token) {
      return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }

    const blogData = {...request.body}
    if (blogData.url === undefined) return response.status(400).end()
    if (blogData.title === undefined) return response.status(400).end()
    if (blogData.likes === undefined) blogData.likes = 0
    
    const user = await User.findById(decodedToken.id)
    blogData.user = user._id
    const blog = new Blog(blogData)

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(Blog.format(savedBlog))  
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, {...body}, { new: true })
    response.json(Blog.format(updatedBlog))
  } catch (exception) {
    console.log(exception)
    response.status(400).end()
  }
})


const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

module.exports = blogsRouter