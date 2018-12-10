if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.DB_URL

if (process.env.NODE_ENV === 'test') {
  port = process.env.PORT_TEST
  mongoUrl = process.env.DB_URL_TEST
}

module.exports = {
  mongoUrl,
  port
}