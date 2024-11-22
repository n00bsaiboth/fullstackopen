require('dotenv').config()

const port = process.env.PORT
const url = process.env.MONGODB_URI 

module.exports = { port, url }