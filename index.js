const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.static("build"));
app.use(express.json());

morgan.token("postBody", function (req, res) {
	return JSON.stringify(req.body);
});

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :postBody"
	)
);

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/api/persons", (req, res) => {
	console.log("Getting persons..");
	res.json(persons);
});

app.get("/info", (req, res) => {
	console.log("Getting info...");
	responseString = `<p>Phonebook has info for ${
		persons.length
	} people <br/> ${new Date()}</p>`;
	res.send(responseString);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	console.log(`Getting person with id ${id}...`);
	const person = persons.find((person) => Number(id) === person.id);
	res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	console.log(`Deleting person with id ${id}...`);
	persons = persons.filter((person) => person.id !== id);
	res.status(204).end();
});

const generateId = () => {
	return Math.floor(Math.random() * 10000);
};

app.post("/api/persons", (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		console.log("name or number missing");
		return res.status(400).json({ error: "name or number missing" });
	}

	if (persons.find((person) => person.name === body.name)) {
		console.log("name must be unique");
		return res.status(400).json({ error: "name must be unique" });
	}

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};
	console.log(`Adding person ${JSON.stringify(person)}`);
	persons = persons.concat(person);
	res.json(person);
});

app.get("");

PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
