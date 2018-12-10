const Blog = require('../models/blog')
const User = require('../models/user')

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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

const userById = async (id) => {
  const user = await User.findById(id)
  return User.format(user)
}

module.exports = {
  blogsInDb,
  format,
  blogById,
  userById,
  usersInDb,
}
