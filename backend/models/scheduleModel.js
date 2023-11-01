const mongoose = require("mongoose");

// Custom validator function for time in 'HH:mm AM/PM' format
function validateTime(value) {
	if (value !== "N/A") {
		const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;

		if (!timeRegex.test(value)) {
			throw new Error("Invalid time format. Use 'HH:mm AM/PM' format.");
		}
	}
}

// Generate time slots from 9 AM to 5 PM with 30-minute intervals
const timeSlots = [];
for (let hour = 9; hour <= 17; hour++) {
	for (let minute = 0; minute <= 30; minute += 30) {
		if (hour == 17 && minute == 30) {
			break;
		} else {
			const ampm = hour < 12 ? "AM" : "PM";
			const hourFormatted = hour % 12 || 12;
			const timeSlot = `${hourFormatted.toString().padStart(2, "0")}:${minute
				.toString()
				.padStart(2, "0")} ${ampm}`;
			timeSlots.push(timeSlot);
		}
	}
}
timeSlots.push("N/A");

const doctorScheduleSchema = new mongoose.Schema({
	doctor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	dayOfWeek: {
		type: String,
		enum: [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		],
	},
	startTime: {
		type: String,
		required: function () {
			return this.dayOfWeek !== undefined;
		},
		validator: [validateTime, "Invalid format"],
		enum: timeSlots,
	},
	endTime: {
		type: String,
		required: function () {
			return this.dayOfWeek !== undefined;
		},
		validator: [validateTime, "Invalid format"],
		enum: timeSlots,
	},
	lunchBreakStart: {
		type: String,
		default: undefined,
		validator: [validateTime, "Invalid format"],
		enum: timeSlots,
	},
	lunchBreakEnd: {
		type: String,
		default: undefined,
		validator: [validateTime, "Invalid format"],
		enum: timeSlots,
	},
	breaks: [
		{
			startDate: { type: Date, require: true },
			endDate: { type: Date },
			reason: {
				type: String,
				enum: ["Vacation", "Holiday", "Personal Reasons"],
				required: true,
			},
		},
	],
});

const DoctorSchedule = mongoose.model(
	"DoctorSchedule",
	doctorScheduleSchema,
	"scheduleDetails"
);

module.exports = DoctorSchedule;
