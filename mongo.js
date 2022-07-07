const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://llonnrot:${password}@cluster0.eyuu3.mongodb.net/phonebookApp?retryWrites=true&w=majority`


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	mongoose
		.connect(url)
		Person.find({}).then(result => {
			console.log('phonebook :')
			result.forEach(person => {
				console.log(person.name + " " + person.number)
			})
			return mongoose.connection.close()
		})
		.catch((err) => console.log(err))
}
else {
	mongoose
		.connect(url)
		.then((result) => {
			console.log('connected')

			const person = new Person({
			name: process.argv[3],
			number: process.argv[4],
			id: Math.floor(Math.random(10, 1000) * 1001)
			})
			return person.save()
		})
		.then(() => {
			console.log('added ' + process.argv[3] + ' number ' + process.argv[4] + ' to phonbeook')
			return mongoose.connection.close()
		})
		.catch((err) => console.log(err))
}