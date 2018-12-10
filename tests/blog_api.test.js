const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

describe('blog api', () => {
  test('blogs are returned', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})


afterAll(() => {
  server.close()
})