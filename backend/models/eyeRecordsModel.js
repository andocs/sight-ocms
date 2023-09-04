const mongoose = require("mongoose");

const eyeRecordSchema = new mongoose.Schema(
	{
		patient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		rightEye: {
			sphere: {
				type: String,
				// required: true
			},
			cylinder: {
				type: String,
				// required: true
			},
			axis: {
				type: String,
				// required: true
			},
		},
		leftEye: {
			sphere: {
				type: String,
				// required: true
			},
			cylinder: {
				type: String,
				// required: true
			},
			axis: {
				type: String,
				// required: true
			},
		},
		additionalNotes: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const EyeRecord = mongoose.model("EyeRecord", eyeRecordSchema, "recordDetails");

module.exports = EyeRecord;
