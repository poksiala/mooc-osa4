const supertest = require('supertest')
const { app, server } = require('../index')
const Blog = require('../models/blog')
const {blogsInDb} = require('./blog_api_helper')
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

    const before = await blogsInDb()
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    
    const after = await blogsInDb()

    expect(after.length).toBe(before.length + 1)
    expect(after).toContainEqual(newBlog)
  })

  test('likes default to 0', async () => {
    const newBlog = {
      title: 'test',
      author: 'test',
      url: 'http://example.com'
    }

    const before = blogsInDb()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const after = blogsInDb()

    expect(response.body.likes).toBe(0)
    expect(after.length).toBe(before.length + 1)
  })

  test('POST without url is refused', async () => {
    const newBlog = {
      title: 'test',
      author: 'test',
    }

    const before = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const after = await blogsInDb()

    expect(after.length).toBe(before.length)
  })

  test('POST without title is refused', async () => {
    const newBlog = {
      author: 'test',
      url: 'http://example.com'
    }

    const before = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const after = await blogsInDb()

    expect(after.length).toBe(before.length)
  })

  afterAll(() => {
    server.close()
  })

})
