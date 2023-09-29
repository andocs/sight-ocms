const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
	{
		itemName: {
			type: String,
			required: true,
			validate: {
				validator: function (value) {
					const strippedString = value.replace(/\s+/g, "");
					if (strippedString.length < 2) {
						return false;
					}
					const twoChars = strippedString.substr(0, 2);
					const string = strippedString.substr(2);
					return (
						/^[A-Za-z0-9]+$/.test(twoChars) || /^[A-Za-z0-9\s\S]*$/.test(string)
					);
				},
				message:
					"Item Name must contain at least 2 non-space and non-special characters",
			},
		},
		category: {
			type: String,
			required: true,
			enum: ["Frame", "Lens", "Medicine", "Others"],
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		unit: {
			type: String,
			required: true,
			enum: ["piece", "box"],
		},
		piecesPerBox: {
			type: Number,
			required: function () {
				return this.unit === "box";
			},
		},
		criticalLevel: {
			type: Number,
			default: 1,
			min: 1,
		},
		restockLevel: {
			type: Number,
			default: 1,
			min: 1,
		},
		price: {
			type: Number,
			required: true,
			min: 1,
		},
		vendor: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
			validate: {
				validator: function (value) {
					const strippedString = value.replace(/\s+/g, "");
					if (strippedString.length < 2) {
						return false;
					}
					const twoChars = strippedString.substr(0, 2);
					const string = strippedString.substr(2);
					return (
						/^[A-Za-z0-9]+$/.test(twoChars) || /^[A-Za-z0-9\s\S]*$/.test(string)
					);
				},
				message:
					"Description must contain at least 2 non-space and non-special characters",
			},
		},
		image: {
			type: String,
		},
		batches: {
			type: [
				{
					batchNumber: {
						type: String,
						required: function () {
							return this.category === "Medicine";
						},
					},
					expirationDate: {
						type: Date,
						required: function () {
							return this.category === "Medicine";
						},
					},
					batchQuantity: {
						type: Number,
						required: function () {
							return this.category === "Medicine";
						},
					},
				},
			],
			validate: [
				function (batches) {
					if (
						this.category === "Medicine" &&
						(!batches || batches.length === 0)
					) {
						throw new Error("Batches are required for 'Medicine' category.");
					}
				},
				{ message: "Batches are required for 'Medicine' category." },
			],
		},
	},
	{
		timestamps: true,
	}
);

const Inventory = mongoose.model(
	"Inventory",
	inventorySchema,
	"inventoryDetails"
);

module.exports = Inventory;
