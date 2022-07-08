const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

const app = express();
app.use(express.json());
app.use(express.static('build'));
app.use(cors());

morgan.token('person', (request, response) => {
	return JSON.stringify(request.body);
});

app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :person'
	)
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

/* app.get('/info', (request, response) => {
	let amount = persons.length;
	let date = Date(response);
	response.send(
		'<p>Phonebook has info for ' + amount + ' people</p><p>' + date + '</p'
	);
}); */

app.get('/api/persons/:id', (request, response) => {
	let id = request.params.id;
	Person.find({id}).then((persons) => {
		response.json(persons);
	});
}); 

app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;
	const num = Number.id
	Person.findByIdAndRemove(num)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	const newPerson = new Person({
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random(10, 1000) * 1001),
	});

	newPerson.save().then((savedPerson) => {
		response.json(savedPerson);
	});
});
