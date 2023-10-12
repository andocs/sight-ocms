const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema(
	{
		technician: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		patient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		repairTime: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: ["Pending", "In Progress", "Completed", "Cancelled"],
			required: true,
		},
		repairItems: [
			{
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Inventory",
				},
				itemName: {
					type: String,
				},
				price: {
					type: Number,
				},
				quantity: {
					type: Number,
				},
				total: {
					type: Number,
				},
			},
		],
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
