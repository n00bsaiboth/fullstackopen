const mongoose = require('mongoose')

const employeesSchema = new mongoose.Schema({
	name: String,
	address: String,
	phone_number: String,
	email_address: String,
})

employeesSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Employee', employeesSchema);

