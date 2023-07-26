const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'patient', 'doctor', 'technician'],
    default: 'patient',
  },
  isPersonalInfoComplete: {
    type: Boolean,
    default: false,
  },
  personalInfo: {
    fname: String,
    lname: String,
    contact: String,
    address: String,
    city: String,
    province: String,
    postal: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema, "userDetails");
