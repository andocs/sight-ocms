const mongoose = require('mongoose');

// Enum for the days of the week
const daysOfWeekEnum = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Enum for the available time intervals from 9:00 AM to 5:00 PM with 30-minute intervals
const availableTimeIntervals = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];

const doctorScheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dayOfWeek: {
    type: String,
    enum: daysOfWeekEnum,
    required: true,
  },
  startTime: {
    type: String,
    enum: availableTimeIntervals,
    required: true,
  },
  endTime: {
    type: String,
    enum: availableTimeIntervals,
    required: true,
  },
});

const DoctorSchedule = mongoose.model('Schedule', doctorScheduleSchema, 'scheduleDetails');

module.exports = DoctorSchedule;
