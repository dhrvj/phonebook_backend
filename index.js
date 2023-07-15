// imports
require("dotenv").config();
const morgan = require("morgan");
const Person = require("./models/persons");
const express = require("express");

const app = express();

// middleware definitions
const errorHandler = (err, req, res, next) => {
	console.error("error:", err.message);
	if (err.name === "CastError") {
		return res.status(400).json({ error: err.message });
		// return res.status(400).json({ error: "malformatted id" });
	} else if (err.name === "ValidationError") {
		return res.status(400).json({ error: err.message });
	}

	next(err);
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

morgan.token("postBody", function (req, res) {
	return JSON.stringify(req.body);
});

// use statements
app.use(express.static("build"));
app.use(express.json());
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :postBody"
	)
);

// routes
app.get("/api/persons", (req, res, next) => {
	console.log("Getting persons..");
	Person.find({}).then((result) => {
		res.json(result);
	});
});

app.get("/info", (req, res, next) => {
	console.log("Getting info...");
	Person.countDocuments({})
		.then((count) => {
			console.log(count);
			responseString = `<p>Phonebook has info for ${count} people <br/> ${new Date()}</p>`;
			res.send(responseString);
		})
		.catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;
	console.log(`Getting person with id ${id}...`);
	Person.findById(id)
		.then((result) => {
			if (result) res.json(result);
			else res.status(404).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
	const body = req.body;
	const person = new Person({
		name: body.name,
		number: body.number,
	});

	console.log(`Adding person ${JSON.stringify(person)}`);

	person
		.save()
		.then((result) => {
			res.json(result);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;
	console.log(`Deleting person with id ${id}...`);
	Person.findByIdAndDelete(id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;
	const body = req.body;
	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(id, person, {
		new: true,
		runValidators: true,
		context: "query",
	})
		.then((updatedPerson) => {
			if (updatedPerson) {
				res.json(updatedPerson);
			} else {
				res.status(400).json({ "error": `${person.name} was already deleted`})
			}
		})
		.catch((error) => next(error));
});

//
app.use(unknownEndpoint);
app.use(errorHandler);

PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`);
});
