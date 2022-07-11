const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

const app = express();
app.use(express.json());
app.use(express.static('build'));
app.use(cors());

morgan.token('person', (request) => {
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

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get('/info', (request, response) => {
	Person.find({}).then((persons) => {
		let date = Date(response);
		response.send(
			'<p>Phonebook has info for ' +
				persons.length +
				' people</p><p>' +
				date +
				'</p'
		);
	});
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((persons) => {
			if (persons) {
				response.json(persons);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
	const body = request.body;

	const newPerson = new Person({
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random(10, 1000) * 1001),
	});

	newPerson
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndUpdate(
		request.params.id,
		{ number: request.body.number },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then((result) => {
			if (result) {
				response.json(result);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			if (result) {
				response.status(204).end();
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.use(errorHandler);
