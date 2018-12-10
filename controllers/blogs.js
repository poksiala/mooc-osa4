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
    if (blogData.likes === undefined) blogData.likes = 0
    const blog = new Blog(blogData)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)  
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

module.exports = blogsRouter