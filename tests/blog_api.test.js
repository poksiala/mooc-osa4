const supertest = require('supertest')
const { app, server } = require('../index')
const Blog = require('../models/blog')
const api = supertest(app)

describe('blog api', async () => {

  beforeAll(async () => {
    await Blog.remove({})
  })

  test('blogs are returned', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('valid blog can be added', async() => {
    const newBlog = {
      title: 'test',
      author: 'test',
      likes: 1,
      url: 'http://example.com'
    }

    const initialBlogs = await api.get('/api/blogs').expect(200)
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    
    const response = await api
      .get('/api/blogs')
      .expect(200)

    expect(response.body.length).toBe(initialBlogs.body.length + 1)

  })

  afterAll(() => {
    server.close()
  })

})
