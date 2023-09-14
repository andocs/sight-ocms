const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["Pending", "In Progress", "Completed"],
			default: "Pending",
		},
		details: {
			type: String,
			required: true,
		},
		technician: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		image: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const Maintenance = mongoose.model(
	"Maintenance",
	maintenanceSchema,
	"maintenanceDetails"
);

module.exports = Maintenance;
