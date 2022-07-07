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
});

let len = persons.length + 1;

const newId = () => {
	return Math.floor(Math.random(len, 100) * 101);
};

app.post('/api/persons', (request, response) => {
	const body = request.body;
	const nam = persons.find((person) => person.name === body.name);

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'name or number missing',
		});
	}

	if (nam) {
		return response.status(400).json({
			error: 'name already in use',
		});
	}

	const newPerson = {
		name: body.name,
		number: body.number,
		id: newId(),
	};

	persons = persons.concat(newPerson);
	response.json(newPerson);
}); */
