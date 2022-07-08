const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_DB_URI;

console.log('connecting to', url);

mongoose
	.connect(url)
	.then((result) => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		type: String,
		minLength: 8,
		validate: {
			validator: function(v) {
				if(/\d{2}-\d{6,100}/.test(v) || /\d{3}-\d{5,100}/.test(v)) {
					return true
				} else {
					return false
				}
			},
			message: props => `${props.value} is not a valid phone number!`
		},
		required: [true, 'User phone number required']
		},
		id: Number
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
