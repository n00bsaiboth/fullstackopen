const employeesRouter = require('express').Router()
const logger = require('../utils/logger')
const Employee = require('../models/employees')

employeesRouter.get('/api', (request, response) => {
	response.send('Welcome to the backend api')
})

employeesRouter.get('/api/employees', (request, response) => {
	Employee.find({})
		.then(employees => {
			logger.info(employees)
			response.json(employees)
		})
		.catch(error => next(error))
})

employeesRouter.get('/api/employees/:id', (request, response, next) => {
	Employee.findById(request.params.id)
		.then(employee => {
			if (employee) {
				logger.info(employee)
				response.json(employee)
			} else {
				response.status(404).json({
					error: 'could not find an employee or user with that ID.'
				})

				logger.error('could not find an employee or user with that ID.')
			}
		})
		.catch(error => next(error))
})

employeesRouter.put('/api/employees/:id', (request, response, next) => {
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

employeesRouter.delete('/api/employees/:id', (request, response, next) => {
	Employee.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

employeesRouter.post('/api/employees', (request, response) => {
	const temporary = request.body

	if(temporary.name === undefined) {
		logger.error('content is missing.')

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
	
	employee.save()
		.then(temporaryEmployee => {
			console.log(temporaryEmployee)
			response.json(temporaryEmployee)
		})
		.catch(error => next(error))
})

module.exports = employeesRouter