const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema(
	{
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		technician: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		patient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		acceptTime: {
			type: Date,
		},
		completeTime: {
			type: Date,
		},
		status: {
			type: String,
			enum: ["Pending", "In Progress", "Completed", "Cancelled"],
			required: true,
		},
		itemType: {
			type: String,
			enum: ["Frame", "Lens", "Others"],
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Repair = mongoose.model("Repair", repairSchema, "repairDetails");

module.exports = Repair;
