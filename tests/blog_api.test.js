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

  test('valid blog can be added', async () => {
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

  test('likes default to 0', async () => {
    const newBlog = {
      title: 'test',
      author: 'test',
      url: 'http://example.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })

  test('POST without url is refused', async () => {
    const newBlog = {
      title: 'test',
      author: 'test',
    }

    const before = await api.get('/api/blogs').expect(200)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const after = await api.get('/api/blogs').expect(200)

    expect(after.body.length).toBe(before.body.length)
  })

  test('POST without title is refused', async () => {
    const newBlog = {
      author: 'test',
      url: 'http://example.com'
    }

    const before = await api.get('/api/blogs').expect(200)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const after = await api.get('/api/blogs').expect(200)

    expect(after.body.length).toBe(before.body.length)
  })

  afterAll(() => {
    server.close()
  })

})
