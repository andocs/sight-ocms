const asyncHandler = require("express-async-handler");
const EyeRecord = require("../models/eyeRecordsModel");
const Transaction = require("../models/transactionModel");

/**
##### EYE RECORDS (READ ONLY) #####
**/

//@desc GET LIST OF PATIENT'S EYE RECORDS
//@route GET /api/patient/records
//@access Private (patient only)
const getRecords = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const eyeRecords = await EyeRecord.find({ patient: patientId });
  res.json(eyeRecords);
});

//@desc GET DETAILS OF PATIENT'S EYE RECORD
//@route GET /api/patient/records/:id
//@access private (patient only)
const getRecordDetails = asyncHandler(async (req, res) => {
  const recordId = req.params.id;
  const patientId = req.user.id;

  const record = await EyeRecord.findOne({
    _id: recordId,
    patient: patientId,
  });

  if (!record) {
    res.status(404);
    throw new Error('Transaction not found!');
  }
  res.json(record);
});

/**
##### TRANSACTIONS (READ ONLY) #####
**/

//@desc GET LIST OF PATIENT'S TRANSACTIONS
//@route GET /api/patient/transactions
//@access Private (patient only)
const getTransactions = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const transactions = await Transaction.find({ patient: patientId });
  res.json(transactions);
});

//@desc GET PATIENT'S TRANSACTION DETAILS
//@route GET /api/patient/transactions/:id
//@access private (patient only)
const getTransactionDetails = asyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  const patientId = req.user.id;

  const transaction = await Transaction.findOne({
    _id: transactionId,
    patient: patientId,
  });

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found!');
  }
  res.json(transaction);
});

module.exports = {
  getRecords,
  getRecordDetails,

  getTransactions,
  getTransactionDetails
};
