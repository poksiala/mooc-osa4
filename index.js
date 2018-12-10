const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')

mongoose.connect(config.mongoUrl)
  .then(() => {
    console.log('conected to database')
  })
  .catch(err => {
    console.error(err)
  })

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/blogs', blogsRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app,
  server,
}