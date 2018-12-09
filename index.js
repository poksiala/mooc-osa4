const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/blogs', blogsRouter)

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('conected to database')
  })
  .catch(err => {
    console.error(err)
  })

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})