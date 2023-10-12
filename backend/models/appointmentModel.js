const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
	{
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		patient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		appointmentDate: {
			type: Date,
			required: true,
		},
		appointmentStart: {
			type: String,
			required: true,
		},
		appointmentEnd: {
			type: String,
			required: true,
		},
		notes: {
			type: String,
		},
		status: {
			type: String,
			enum: ["Scheduled", "Confirmed", "Cancelled", "Pending", "Completed"],
			default: "Pending",
		},
		staff: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const Appointment = mongoose.model(
	"Appointment",
	appointmentSchema,
	"appointmentDetails"
);

module.exports = Appointment;
