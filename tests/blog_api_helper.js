const Blog = require('../models/blog')


const format = blog => {
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
    url: blog.url
  }
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(format)
}

const blogById = async (id) => {
  const blog = await Blog.findById(id)
  return format(blog)
}

module.exports = {
  blogsInDb,
  format,
  blogById,
}
