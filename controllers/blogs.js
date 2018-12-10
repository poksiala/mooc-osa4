const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blogData = {...request.body}
    if (blogData.url === undefined) return response.status(400).end()
    if (blogData.title === undefined) return response.status(400).end()
    
    if (blogData.likes === undefined) blogData.likes = 0
    const blog = new Blog(blogData)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)  
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

module.exports = blogsRouter