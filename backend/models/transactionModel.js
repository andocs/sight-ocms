const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  typeOfLens: {
    type: String,
    required: true,
  },
  typeOfFrame: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
},
  {
  timestamps: true
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema, "transactionDetails");

module.exports = Transaction;
