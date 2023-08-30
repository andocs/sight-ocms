const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
	{
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		patient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		patientType: {
			type: String,
			enum: ["Walk-In", "Registered"],
			required: true,
		},
		visitDate: {
			type: Date,
			required: true,
		},
		visitType: {
			type: String,
			enum: ["Appointment", "First Visit", "Follow-Up"],
			required: true,
		},
		reason: {
			type: String,
			required: true,
		},
		medicalHistory: {
			type: String,
		},
		additionalInfo: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Visit", visitSchema, "visitDetails");
