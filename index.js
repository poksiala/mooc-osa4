const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')


const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/blogs', blogsRouter)

mongoose.connect(config.mongoUrl)
  .then(() => {
    console.log('conected to database')
  })
  .catch(err => {
    console.error(err)
  })

const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})