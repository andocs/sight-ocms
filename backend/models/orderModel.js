const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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
		orderTime: {
			type: Date,
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
		frame: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Inventory",
			required: true,
		},
		frameQuantity: {
			type: Number,
			required: true,
		},
		framePrice: {
			type: Number,
			required: true,
		},
		lens: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Inventory",
			required: true,
		},
		lensQuantity: {
			type: Number,
			required: true,
		},
		lensPrice: {
			type: Number,
			required: true,
		},
		otherItems: [
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

const Order = mongoose.model("Order", orderSchema, "orderDetails");

module.exports = Order;
