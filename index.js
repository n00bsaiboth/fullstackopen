require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const Employee = require('./models/employees')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 4000

const unknownEndpoint = (request, response) => {
	response.status(404).json({
		error: 'unknown endpoint'
	})
}

const logger = (request, response, next) => {
	console.log('method: ', request.method)
	console.log('path: ', request.path)
	console.log('body: ', request.body)
	console.log('---')
	next()
}

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}

const generateId = () => {
	const lastId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
	return Number(lastId + 1)
}

app.get('/api', (request, response) => {
	response.send('Welcome to the backend api')
})

app.get('/api/employees', (request, response) => {
	Employee.find({}).then(employees => {
		console.log(employees)
		response.json(employees)
	})
})

app.get('/api/employees/:id', (request, response, next) => {
	Employee.findById(request.params.id)
		.then(employee => {
			if (employee) {
				console.log(employee)
				response.json(employee)
			} else {
				response.status(404).json({
					error: 'content is missing.'
				})
			}
		})
		.catch(error => next(error))
})

app.put('/api/employees/:id', (request, response, next) => {
	const temporary = request.body

	const employee = {
		name: temporary.name,
		address: temporary.address,
		phone_number: temporary.phone_number,
		email_address: temporary.email_address,
	}

	Employee.findByIdAndUpdate(request.params.id, employee, { new: true })
		.then(temporaryEmployee => {
			response.json(temporaryEmployee)
		})
		.catch(error => next(error))
})

app.delete('/api/employees/:id', (request, response, next) => {
	Employee.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/employees', (request, response) => {
	const temporary = request.body

	if(temporary.name === undefined) {
		return response.status(400).json({
			error: 'content is missing.'
		})
	}
	
	const employee = new Employee({
		name: temporary.name,
		address: temporary.address,
		phone_number: temporary.phone_number,
		email_address: temporary.email_address,
	})
	
	employee.save().then(temporaryEmployee => {
		console.log(temporaryEmployee)
		response.json(temporaryEmployee)
	})
})

app.use(unknownEndpoint)
app.use(logger)
app.use(errorHandler)

app.listen(port, () => {
	console.log(`Server is running on port ${port}.`)
})
