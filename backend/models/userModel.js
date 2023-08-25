const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			// match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Invalid email format'],
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "patient", "doctor", "technician"],
			default: "patient",
		},
		isPersonalInfoComplete: {
			type: Boolean,
			default: false,
		},
		personalInfo: {
			fname: String,
			lname: String,
			gender: String,
			contact: String,
			address: String,
			city: String,
			province: String,
		},
		image: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema, "userDetails");
