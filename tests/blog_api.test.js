const supertest = require('supertest')
const { app, server } = require('../index')
const Blog = require('../models/blog')
const {blogsInDb, blogById} = require('./blog_api_helper')
const api = supertest(app)

describe('GET blog api', async () => {

  test('blogs are returned', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST blog api', async () => {

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

    const before = await blogsInDb()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const after = await blogsInDb()

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
})

describe('DELETE blog api', async () => {
  let addedBlog
  
  beforeAll(async () => {
    await Blog.remove({})

    addedBlog = new Blog({
      title: 'test',
      author: 'test',
      likes: 1,
      url: 'http://example.com'
    })
    await addedBlog.save()

  })

  test('blog can be deleted', async () => {
    const before = await blogsInDb()
    
    await api
      .delete(`/api/blogs/${addedBlog.id}`)
      .expect(204)

    const after = await blogsInDb()
    expect(after.length).toBe(before.length - 1)

  })

  test('invalid id is responded with 400', async () => {
    const before = await blogsInDb()
    
    const invalidId = '12938ueutypquwhps'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)

    const after = await blogsInDb()
    expect(after.length).toBe(before.length)
  })
})

describe('PUT blog api', async () => {
  let addedBlog
  
  beforeAll(async () => {
    await Blog.remove({})

    addedBlog = new Blog({
      title: 'test',
      author: 'test',
      likes: 1,
      url: 'http://example.com'
    })
    await addedBlog.save()

  })

  test('blog can be updated', async () => {
    const before = await blogById(addedBlog.id)
    const alt = {...before}
    alt.likes += 1

    const response = await api
      .put(`/api/blogs/${addedBlog.id}`)
      .send(alt)
      .expect(200)

    const after = await blogById(addedBlog.id)

    expect(after.likes).toBe(before.likes + 1)
    expect(response.body.likes).toBe(after.likes)
  })

  test('invalid id is responded with 400', async () => {

    const invalidId = '12938ueutypquwhps'

    await api
      .put(`/api/blogs/${invalidId}`)
      .expect(400)

  })
})


afterAll(() => {
  server.close()
})
