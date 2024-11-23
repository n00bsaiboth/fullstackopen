const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const express = require('express')
const app = express()

const cors = require('cors')

const employeesRouter = require('./controllers/employees')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const mongoose = require('mongoose')
const { applyDefaults } = require('./models/employees')
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

app.use('/', employeesRouter)
app.use('/', usersRouter)
app.use('/', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app