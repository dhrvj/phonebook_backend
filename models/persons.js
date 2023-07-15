const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

console.log("connecting to", url);

mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to mongodb");
	})
	.catch((error) => {
		console.log("error connecting to mongodb: ", error);
	});

mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: [true, "name required"]
	},
	number: {
		type: String,
		required: [true, "phone number required"],
		minLength: 8,
		validate: {
			validator: (value) => {
				return (/^\d{2,3}-\d+$/).test(value);
				/*
					^ asserts the start of the string.
					\d{2,3} matches two or three digits.
					- matches the hyphen character literally.
					\d+ matches one or more digits.
					$ asserts the end of the string.
				*/
			},
			message: "invalid phone number",
		},
	},
});

personSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
