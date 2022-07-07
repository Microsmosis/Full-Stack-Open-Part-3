const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

const app = express();
app.use(express.json());

morgan.token('person', (request, response) => {
	return JSON.stringify(request.body);
});

app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :person'
	)
);

app.use(cors());
app.use(express.static('build'));

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
});

app.get('/api/persons/:id', (request, response) => {
	let id = request.params.id;
	let single = persons.find((person) => person.id === Number(id));
	response.json(single);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);
	response.status(204).end();
}); */

app.post('/api/persons', (request, response) => {
	const body = request.body;

	const newPerson = new Person({
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random(10, 1000) * 1001)
	});

	newPerson.save()
		.then(savedPerson => {
			response.json(savedPerson)
		})
});
