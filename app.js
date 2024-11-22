const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const express = require('express')
const app = express()

const cors = require('cors')

const employeessRouter = require('./controllers/employees')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

logger.info('connecting to, ', config.url)

mongoose.connect(config.url)
	.then(result => {
		logger.info('connected to MongoDB. ')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB. ', error.message)
	})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/', employeessRouter);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app