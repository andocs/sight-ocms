const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const EyeRecord = require("../models/eyeRecordsModel");
const Appointment = require("../models/appointmentModel");
const auditLogController  = require("./auditLogController");

/**
##### FUNCTIONS #####
**/

// Function to generate a receipt
const generateReceipt = (transaction) => {
  // Placeholder logic for generating a receipt
  const receipt = {
    id: transaction._id,
    patientName: transaction.patientName,
    typeOfLens: transaction.typeOfLens,
    typeOfFrame: transaction.typeOfFrame,
    amount: transaction.amount,
    timestamp: transaction.createdAt,
    // Add additional receipt properties as needed
  };

  // Customize the receipt formatting or additional calculations as per your requirements

  return receipt;
};

const logAuditTrail = async (doctorId, operation, entity, entityId, oldValues, newValues, userIpAddress, userAgent, additionalInfo, session) => {
  const auditLog = await auditLogController.createAuditLog({
    userId: doctorId,
    operation,
    entity,
    entityId,
    oldValues,
    newValues,
    userIpAddress,
    userAgent,
    additionalInfo,
    session, // Pass the MongoDB session to the audit log creation function
  });
  return auditLog;
};

/**
##### TRANSACTIONS #####
**/

//@desc Create a new transaction
//@route POST /api/doctor/transactions
//@access private (doctor only)
const createTransaction = asyncHandler(async (req, res) => {
  const {
    patientId,
    typeOfLens,
    typeOfFrame,
    amount
  } = req.body;

  const patient = await User.findById(patientId);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found!');
  }

  // Create a new transaction
  const transaction = await Transaction.create({
    doctor: req.user.id,
    patient: patient._id,
    typeOfLens,
    typeOfFrame,
    amount
  });

  // Generate receipt
  const receipt = generateReceipt(transaction);

  res.status(201).json({ transaction, receipt });
});

//@desc Get all transactions for a doctor
//@route GET /api/doctor/transactions
//@access private (doctor only)
const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ doctor: req.user.id })
  res.json(transactions);
});

//@desc Get transaction details
//@route GET /api/doctor/transactions/:id
//@access private (doctor only)
const getTransactionDetails = asyncHandler(async (req, res) => {
  const transactionId = req.params.id;
  const doctorId = req.user.id;

  const transaction = await Transaction.findOne({
    _id: transactionId,
    doctor: doctorId,
  });

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found!');
  }
  res.json(transaction);
});

//@desc Update a transaction
//@route PUT /api/doctor/transactions/:id
//@access private (doctor only)
const updateTransaction = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const transactionId = req.params.id;

  const transaction = await EyeRecord.findOne({
    _id: transactionId,
    doctor: doctorId,
  });

  if (!transaction) {
    res.status(404);
    throw new Error('Record not found or unauthorized!');
  }

  const {
    typeOfLens,
    typeOfFrame,
    amount,
  } = req.body;

  // Create an object to store the updated fields
  const updatedFields = {};
  if (typeOfLens) updatedFields.typeOfLens = typeOfLens;
  if (typeOfFrame) updatedFields.typeOfFrame = typeOfFrame;
  if (amount) updatedFields.amount = amount;

  // Update the record with the new fields
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    transactionId,
    updatedFields,
    { new: true, runValidators: true }
  );

  res.json(updatedTransaction);

})

//@desc Delete a transaction
//@route DELETE /api/doctor/transactions/:id
//@access private (doctor only)
const deleteTransaction = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const transactionId = req.params.id;

  const transaction = await EyeRecord.findOneAndDelete({
    _id: transactionId,
    doctor: doctorId,
  });

  if (!transaction) {
    res.status(404);
    throw new Error('Record not found or unauthorized!');
  }

  res.json({ message: 'Record deleted successfully' });
});

/**
##### RECORDS #####
**/

//@desc Add a new eye record
//@route POST /api/doctor/records
//@access private (doctor only)
const addRecord = asyncHandler(async (req, res) => {
  const { patientId, rightEye, leftEye, additionalNotes } = req.body;

  const patient = await User.findById(patientId);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found!');
  }

  // Start the transaction
  const session = await EyeRecord.startSession();
  session.startTransaction();

  try {
    const eyeRecord = await EyeRecord.create(
      [{
        doctor: req.user.id,
        patientId: patient._id,
        rightEye: {
          sphere: +2.50,
          cylinder: -1.00,
          axis: 90,
        },
        leftEye: {
          sphere: +2.75,
          cylinder: -0.75,
          axis: 95,
        }
      }],
      { session }
    );

    // Log the audit trail for eye record creation
    await logAuditTrail(
      req.user.id,
      'create', // CRUD operation: 'create', 'update', 'delete', etc.
      'EyeRecord', // Entity type
      eyeRecord[0]._id, // EyeRecord ID
      null, // For creation, there are no old values
      eyeRecord[0], // New eye record values
      req.ip, // User's IP address
      req.get('user-agent'), // User agent information
      'New eye record added', // Additional info (if needed)
      { session } // Pass the MongoDB session to the audit log creation function
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(eyeRecord);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

//@desc Get all records by a doctor
//@route GET /api/doctor/records
//@access private (doctor only)
const getAllRecords = asyncHandler(async (req, res) => {
  const records = await EyeRecord.find({ doctor: req.user.id })
  res.json(records);
});

//@desc Get eye record
//@route GET /api/doctor/records/:id
//@access private (doctor only)
const getRecordDetails = asyncHandler(async (req, res) => {
  const recordId = req.params.id;
  const doctorId = req.user.id;

  const record = await EyeRecord.findOne({
    _id: recordId,
    doctor: doctorId,
  });

  if (!record) {
    res.status(404);
    throw new Error('Transaction not found!');
  }
  res.json(record);
});

//@desc Update an eye record
//@route PUT /api/doctor/records/:id
//@access private (doctor only)
const updateRecord = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const recordId = req.params.id;

  const record = await EyeRecord.findOne({
    _id: recordId,
    doctor: doctorId,
  });

  if (!record) {
    res.status(404);
    throw new Error('Record not found or unauthorized!');
  }

  const {
    rightEye,
    leftEye,
    additionalNotes,
  } = req.body;

  // Create an object to store the updated fields
  const updatedFields = {};
  if (rightEye) updatedFields.rightEye = rightEye;
  if (leftEye) updatedFields.leftEye = leftEye;
  if (additionalNotes) updatedFields.additionalNotes = additionalNotes;

  // Update the record with the new fields
  const updatedRecord = await EyeRecord.findByIdAndUpdate(
    recordId,
    updatedFields,
    { new: true, runValidators: true }
  );

  res.json(updatedRecord);

})

//@desc Delete an eye record
//@route DELETE /api/doctor/records/:id
//@access private (doctor only)
const deleteRecord = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const recordId = req.params.id;

  const record = await EyeRecord.findOneAndDelete({
    _id: recordId,
    doctor: doctorId,
  });

  if (!record) {
    res.status(404);
    throw new Error('Record not found or unauthorized!');
  }

  res.json({ message: 'Record deleted successfully' });
});

/**
##### APPOINTMENTS #####
**/

const createAppointment = async (req, res) => {
  try {
    const { patientId, date, startTime, endTime, notes } = req.body;

    // Check if the patient exists (you may need to validate the patientId)
    // Assuming the authenticated user is a doctor, and their ID is available in req.user.id
    const doctorId = req.user.id;

    // Create the new appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date,
      startTime,
      endTime,
      notes,
    });

    // Log the audit trail for appointment creation
    await logAuditTrail(
      doctorId,
      req.user.email, // Assuming the authenticated user has an email field
      'create', // CRUD operation: 'create', 'update', 'delete', etc.
      'Appointment', // Entity type
      appointment._id, // Appointment ID
      null, // For creation, there are no old values
      appointment, // New appointment values
      req.ip, // User's IP address
      req.get('user-agent'), // User agent information
      'New appointment created' // Additional info (if needed)
    );

    res.status(201).json({ appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to update an existing appointment with rescheduling
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId, date, startTime, endTime, notes } = req.body;

    // Check if the appointment exists and belongs to the authenticated doctor
    // Assuming the authenticated user is a doctor, and their ID is available in req.user.id
    const doctorId = req.user.id;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized!' });
    }

    // Store the old values for the audit trail
    const oldValues = {
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      notes: appointment.notes,
    };

    // Update the appointment with the new values
    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.notes = notes;
    await appointment.save();

    // Log the audit trail for appointment update (with rescheduling)
    await logAuditTrail(
      doctorId,
      req.user.email, // Assuming the authenticated user has an email field
      'update', // CRUD operation: 'create', 'update', 'delete', etc.
      'Appointment', // Entity type
      appointment._id, // Appointment ID
      oldValues, // Old appointment values
      appointment, // New appointment values
      req.ip, // User's IP address
      req.get('user-agent'), // User agent information
      'Appointment rescheduled' // Additional info (if needed)
    );

    res.json({ appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to delete or cancel an existing appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Check if the appointment exists and belongs to the authenticated doctor
    // Assuming the authenticated user is a doctor, and their ID is available in req.user.id
    const doctorId = req.user.id;
    const appointment = await Appointment.findOneAndDelete({
      _id: appointmentId,
      doctor: doctorId,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized!' });
    }

    // Log the audit trail for appointment deletion or cancellation
    await logAuditTrail(
      doctorId,
      req.user.email, // Assuming the authenticated user has an email field
      'delete', // CRUD operation: 'create', 'update', 'delete', etc.
      'Appointment', // Entity type
      appointment._id, // Appointment ID
      appointment, // Old appointment values (for record keeping)
      null, // For deletion, there are no new values
      req.ip, // User's IP address
      req.get('user-agent'), // User agent information
      'Appointment cancelled or deleted' // Additional info (if needed)
    );

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionDetails,
  updateTransaction,
  deleteTransaction,
  addRecord,
  getAllRecords,
  getRecordDetails,
  updateRecord,
  deleteRecord
};
