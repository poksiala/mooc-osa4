const supertest = require('supertest')
const { app, server } = require('../index')
const Blog = require('../models/blog')
const User = require('../models/user')
const {blogsInDb, blogById, usersInDb, userById} = require('./api_helper')
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

describe('GET user api', async () => {

  test('GET / 200', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST user api', async () => {
  let exsistingUser
  beforeAll(async () => {
    await User.remove({})

    exsistingUser = new User({
      username: 'test',
      name: 'test',
      password: 'test',
      adult: true
    })
    await exsistingUser.save()
  })

  test('Valid user can be added', async () => {
    const before = await usersInDb()
    
    const newUser = {
      username: 'test2',
      name: 'test2',
      password: 'test2',
      adult: true
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const after = await usersInDb()

    expect(after.length).toBe(before.length + 1)
  })

  test('Username must be unique', async () => {
    const before = await usersInDb()
    
    const newUser = {
      username: 'test',
      password: '9sd8gy0as9df87g0',
      name: 'alksjd lkasd',
      adult: true
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const after = await usersInDb()

    expect(after.length).toBe(before.length)

  })

  test('pasword must be long enough', async () => {
    const before = await usersInDb()
    
    const newUser = {
      username: 'test2135123',
      password: '9s',
      name: 'alksjd lkasd',
      adult: true
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const after = await usersInDb()

    expect(after.length).toBe(before.length)

  })

  test('Adult defaults to true', async () => {
    const before = await usersInDb()
    
    const newUser = {
      username: 'test2135123',
      password: '9s3543546',
      name: 'alksjd lkasd',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
    

    const createdUser = await userById(response.body.id)

    const after = await usersInDb()

    expect(createdUser.adult).toBe(true)
    expect(after.length).toBe(before.length + 1)

  })
  
})


afterAll(() => {
  server.close()
})