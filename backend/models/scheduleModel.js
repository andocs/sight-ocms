const mongoose = require("mongoose");

// Custom validator function for time in 'HH:mm AM/PM' format
function validateTime(value) {
  const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;

  if (!timeRegex.test(value)) {
    throw new Error("Invalid time format. Use 'HH:mm AM/PM' format.");
  }
}

// Generate time slots from 9 AM to 5 PM with 30-minute intervals
const timeSlots = [];
for (let hour = 9; hour <= 16; hour++) {
  for (let minute = 0; minute <= 30; minute += 30) {
    const ampm = hour < 12 ? "AM" : "PM";
    const hourFormatted = hour % 12 || 12;
    const timeSlot = `${hourFormatted.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${ampm}`;
    timeSlots.push(timeSlot);
  }
}

const doctorScheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dayOfWeek: {
    type: String,
    enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    validate: [validateTime, "Invalid startTime format"],
    enum: timeSlots,
  },
  endTime: {
    type: String,
    required: true,
    validate: [validateTime, "Invalid endTime format"],
    enum: timeSlots,
  },
});

const DoctorSchedule = mongoose.model("DoctorSchedule", doctorScheduleSchema, "scheduleDetails");

module.exports = DoctorSchedule;
