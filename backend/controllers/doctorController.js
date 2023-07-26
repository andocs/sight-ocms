const asyncHandler = require("express-async-handler");
const AuditLog = require("../models/auditLogModel");

const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const EyeRecord = require("../models/eyeRecordsModel");
const Appointment = require("../models/appointmentModel");

const sessionOptions = { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" }  }

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
  };

  // Customize the receipt formatting or additional calculations as per your requirements

  return receipt;
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

  const session = await Transaction.startSession(sessionOptions);
  try{
    session.startTransaction();

    const transaction = await Transaction.create(
      [{
      doctor: req.user.id,
      patient: patient._id,
      typeOfLens,
      typeOfFrame,
      amount
      }],
      { session }
    );

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'create',
      entity: 'Transaction',
      entityId: transaction[0]._id,
      oldValues: null,
      newValues: transaction[0],
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'New transaction added'
      }],
      { session }
    );
    await session.commitTransaction();
    const receipt = generateReceipt(transaction);
    res.status(201).json({ transaction, receipt });
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
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

  const transaction = await Transaction.findOne({
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

  const session = await Transaction.startSession(sessionOptions);
  try{
    session.startTransaction();

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      updatedFields,
      { new: true, runValidators: true, session }
    );

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'update',
      entity: 'Transaction',
      entityId: transactionId,
      oldValues: transaction,
      newValues: updatedTransaction,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'Transaction updated'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json(updatedTransaction);
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
})

//@desc Delete a transaction
//@route DELETE /api/doctor/transactions/:id
//@access private (doctor only)
const deleteTransaction = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const transactionId = req.params.id;

  const session = await Transaction.startSession(sessionOptions);
  try{
    session.startTransaction();
    
    const transaction = await Transaction.findOneAndDelete(
    {
      _id: transactionId,
      doctor: doctorId,
    },
    {session});
  
    if (!transaction) {
      res.status(404);
      throw new Error('Record not found or unauthorized!');
    };

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'delete',
      entity: 'Transaction',
      entityId: transactionId,
      oldValues: transaction,
      newValues: null,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'Transaction deleted'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json('Transaction deleted successfully');
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
});

/**
##### EYE RECORDS #####
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

  const session = await EyeRecord.startSession(sessionOptions);
  try {
    session.startTransaction();

    const eyeRecord = await EyeRecord.create(
      [{
        doctor: req.user.id,
        patientId: patient._id,
        rightEye,
        leftEye,
        additionalNotes
      }],
      { session }
    );

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'create',
      entity: 'EyeRecord',
      entityId: eyeRecord[0]._id,
      oldValues: null,
      newValues: eyeRecord[0],
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'New eye record added'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json(eyeRecord);
  }
  catch (error) {
    await session.abortTransaction();
    throw error;
  }
  session.endSession();
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

  const session = await EyeRecord.startSession(sessionOptions);
  try{
    session.startTransaction();

    const updatedRecord = await EyeRecord.findByIdAndUpdate(
      recordId,
      updatedFields,
      { new: true, runValidators: true, session }
    );

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'update',
      entity: 'EyeRecord',
      entityId: recordId,
      oldValues: record,
      newValues: updatedRecord,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'Eye Record updated'
      }],
      { session }
    );
    await session.commitTransaction();  
    res.status(201).json(updatedRecord);
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
})

//@desc Delete an eye record
//@route DELETE /api/doctor/records/:id
//@access private (doctor only)
const deleteRecord = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const recordId = req.params.id;

  const session = await EyeRecord.startSession(sessionOptions);
  try{
    session.startTransaction();

    const record = await EyeRecord.findOneAndDelete(
    {
      _id: recordId,
      doctor: doctorId,
    },
    { session });

    if (!record) {
      res.status(404);
      throw new Error('Record not found or unauthorized!');
    };

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'delete',
      entity: 'EyeRecord',
      entityId: recordId,
      oldValues: record,
      newValues: null,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'Eye Record deleted'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json('Record deleted successfully');
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
});

/**
##### APPOINTMENTS #####
**/

//@desc Add a appointment
//@route POST /api/doctor/appointments
//@access private (doctor only)
const createAppointment = async (req, res) => {
  const { patientId, date, startTime, endTime, notes } = req.body;

  const doctorId = req.user.id;

  const patient = await User.findById(patientId);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found!');
  }

  const session = await Appointment.startSession(sessionOptions);
  try{
    session.startTransaction();

    const appointment = await Appointment.create(
    [{
      doctor: doctorId,
      patient: patientId,
      date,
      startTime,
      endTime,
      notes,
    }],
    { session });

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'create',
      entity: 'Appointment',
      entityId: appointment[0]._id,
      oldValues: null,
      newValues: appointment[0],
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'New appointment added'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json(appointment);
  }
  catch(error){
    await session.abortTransaction();
    throw error;
  }
  session.endSession(); 
};

//@desc Get all appointments by a doctor
//@route GET /api/doctor/appointments
//@access private (doctor only)
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointment = await Appointment.find({ doctor: req.user.id })
  res.json(appointment);
});

//@desc Get appointment details
//@route GET /api/doctor/appointments/:id
//@access private (doctor only)
const getAppointmentDetails = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const doctorId = req.user.id;

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: doctorId,
  });

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found!');
  }
  res.json(appointment);
});

//@desc Update an appointment
//@route PUT /api/doctor/appointments/:id
//@access private (doctor only)
const updateAppointment = async (req, res) => {
  const doctorId = req.user.id;
  const appointmentId = req.params.id;
  
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: doctorId,
  });

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found or unauthorized!');
  }

  const { 
    date, 
    startTime, 
    endTime, 
    notes 
  } = req.body;

  const updatedFields = {};
  if (date) updatedFields.date = date;
  if (startTime) updatedFields.startTime = startTime;
  if (endTime) updatedFields.endTime = endTime;
  if (notes) updatedFields.notes = notes;

  const session = await Appointment.startSession(sessionOptions);
  try{
    session.startTransaction();
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updatedFields,
      { new: true, runValidators: true, session }
    );

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'update',
      entity: 'Appointment',
      entityId: appointmentId,
      oldValues: appointment,
      newValues: updatedAppointment,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'Appointment updated'
      }],
      { session }
    );
    await session.commitTransaction(); 
    res.status(201).json(appointment);
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
};

//@desc Delete an appointment
//@route DELETE /api/doctor/appointments/:id
//@access private (doctor only)
const deleteAppointment = async (req, res) => {
  const doctorId = req.user.id;
  const appointmentId = req.params.id;

  const session = await Appointment.startSession(sessionOptions);
  try{
    session.startTransaction();

    const appointment = await Appointment.findOneAndDelete(
    {
      _id: appointmentId,
      doctor: doctorId,
    },
    { session });

    if (!appointment) {
      res.status(404)
      throw new Error('Appointment not found or unauthorized!');
    }
    
    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'delete',
      entity: 'Appointment',
      entityId: appointmentId,
      oldValues: appointment,
      newValues: null,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'Appointment deleted'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json('Appointment deleted successfully');

  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
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
  deleteRecord,

  createAppointment,
  getAllAppointments,
  getAppointmentDetails,
  updateAppointment,
  deleteAppointment  
};
