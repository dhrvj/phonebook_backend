const mongoose = require("mongoose");

// const password = process.argv[2];
// const url = `mongodb+srv://gs:${password}@cluster0.z2ihpgt.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

const addPerson = (personObj) => {
	const personDocument = new Person(personObj);
	personDocument.save().then((result) => {
		console.log(
			`added ${personObj.name} number ${personObj.number} to phonebook`
		);
		mongoose.connection.close();
	});
};

const getAllPersons = () => {
	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(person);
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
};

if (process.argv.length === 5) {
	addPerson({
		name: process.argv[3],
		number: process.argv[4],
	});
} else if (process.argv.length === 3) {
	getAllPersons();
}
