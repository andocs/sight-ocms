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
		return res.status(404).json({ message: "Transaction not found!" });
	}
	res.json(record);
});

/**
##### ORDERS (READ ONLY) #####
**/

/**
##### APPOINTMENTS (CRUD) #####
**/

module.exports = {
	getRecords,
	getRecordDetails,

	getTransactions,
	getTransactionDetails,
};
