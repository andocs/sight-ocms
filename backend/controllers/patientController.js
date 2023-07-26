const asyncHandler = require("express-async-handler");
const EyeRecord = require("../models/eyeRecordsModel");
const Transaction = require("../models/transactionModel");

//@desc Get all eye records for a patient
//@route GET /api/patient/records
//@access Private (patient only)
const getRecords = asyncHandler(async (req, res) => {
  const patientId = req.user.id;

  const eyeRecords = await EyeRecord.find({ patient: patientId });

  res.json(eyeRecords);
});

//@desc Get all transactions for a patient
//@route GET /api/patient/transactions
//@access Private (patient only)
const getTransactions = asyncHandler(async (req, res) => {
  const patientId = req.user.id;

  const transactions = await Transaction.find({ patient: patientId });

  res.json(transactions);
});

module.exports = {
  getRecords,
  getTransactions
};
