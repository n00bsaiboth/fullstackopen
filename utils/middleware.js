const logger = require('./logger')

const requestLogger = (request, response, next) => {
	logger.info('method: ', request.method)
	logger.info('path: ', request.path)
	logger.info('body: ', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (request, response) => {
    logger.error('unknown endpoint.')

	response.status(404).json({
		error: 'unknown endpoint.'
	})
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
        logger.error('It seems, that there was a Cast error.')
		
        return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
        logger.error('It seems, that there was a Validation error.')

        return response.status(400).json({ error: error.message })
    }

	next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
