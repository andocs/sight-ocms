const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    required: true,
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  },
  frameType: {
    type: String,
    required: true,
  },
  lensType: {
    type: String,
    required: true,
  },
  // Additional fields related to the order
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
