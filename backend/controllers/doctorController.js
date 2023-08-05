const asyncHandler = require("express-async-handler");
const AuditLog = require("../models/auditLogModel");

const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const EyeRecord = require("../models/eyeRecordsModel");
const Appointment = require("../models/appointmentModel");
const Schedule = require("../models/scheduleModel");
const Order = require("../models/orderModel");

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
##### TRANSACTIONS (CRUD) #####
**/

//@desc ADDS A NEW TRANSACTION
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

//@desc GET THE LIST OF THE DOCTOR'S TRANSACTION
//@route GET /api/doctor/transactions
//@access private (doctor only)
const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ doctor: req.user.id })
  res.json(transactions);
});

//@desc GET TRANSACTION DETAILS
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

//@desc UPDATES EXISTING TRANSACTION
//@route PUT /api/doctor/transactions/:id
//@access private (doctor only)
const updateTransaction = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const transactionId = req.params.id;
  const updatedFields = req.body;

  const transaction = await Transaction.findOne({
    _id: transactionId,
    doctor: doctorId,
  });

  if (!transaction) {
    res.status(404);
    throw new Error('Record not found or unauthorized!');
  }

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
});

//@desc DELETES TRANSACTION
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
    { session });
  
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
##### EYE RECORDS (CRUD) #####
**/

//@desc ADDS A NEW EYE RECORD FOR THE PATIENT
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

//@desc GET ALL THE RECORDS MADE BY THE DOCTOR
//@route GET /api/doctor/records
//@access private (doctor only)
const getAllRecords = asyncHandler(async (req, res) => {
  const records = await EyeRecord.find({ doctor: req.user.id })
  res.json(records);
});

//@desc GET DETAILS OF PATIENT EYE RECORD
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

//@desc UPDATES PATIENT'S EYE RECORD
//@route PUT /api/doctor/records/:id
//@access private (doctor only)
const updateRecord = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const recordId = req.params.id;
  const updatedFields = req.body;

  const record = await EyeRecord.findOne({
    _id: recordId,
    doctor: doctorId,
  });

  if (!record) {
    res.status(404);
    throw new Error('Record not found or unauthorized!');
  }

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

//@desc DELETES EYE RECORD
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
##### APPOINTMENTS (CRUD) #####
**/

//@desc ADDS APPOINTMENT (MAINLY FOLLOW UPS)
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

//@desc GET LIST OF DOCTOR'S APPOINTMENTS
//@route GET /api/doctor/appointments
//@access private (doctor only)
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointment = await Appointment.find({ doctor: req.user.id })
  res.json(appointment);
});

//@desc GET APPOINTMENT DETAILS
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

//@desc UPDATES APPOINTMENT DETAILS
//@route PUT /api/doctor/appointments/:id
//@access private (doctor only)
const updateAppointment = async (req, res) => {
  const doctorId = req.user.id;
  const appointmentId = req.params.id;
  const updatedFields = req.body;
  
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: doctorId,
  });

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found or unauthorized!');
  }

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
    res.status(201).json(updatedAppointment);
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
};

//@desc DELETES APPOINTMENT
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

/**
##### SCHEDULE (CRUD) #####
**/

//@desc ADD DOCTOR SCHEDULE
//@route POST /api/doctor/schedule
//@access private (doctor only)
const addDoctorSchedule = asyncHandler(async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const doctorId = req.user.id;
  const session = await Schedule.startSession(sessionOptions);
  try{
    session.startTransaction();
    const doctorSchedule = await Schedule.create(
    [{
      doctor: doctorId,
      dayOfWeek,
      startTime,
      endTime,
    }],
    { session });

    await AuditLog.create(
      [{
      userId: doctorId,
      operation: 'create',
      entity: 'Schedule',
      entityId: doctorSchedule[0]._id,
      oldValues: null,
      newValues: doctorSchedule[0],
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'New doctor schedule added'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json(doctorSchedule);
  } 
  catch(error){
    await session.abortTransaction();
    throw error;
  }
  session.endSession(); 
});

//@desc GET LIST OF DOCTOR'S SCHEDULE
//@route GET /api/doctor/schedule
//@access private (doctor only)
const getDoctorSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const doctorSchedules = await Schedule.find({ doctor: doctorId });
  res.json(doctorSchedules);
});

//@desc GET SCHEDULE DETAILS
//@route GET /api/doctor/schedule/:id
//@access private (doctor only)
const getScheduleDetails = asyncHandler(async (req, res) => {
  const scheduleId = req.params.id;
  const doctorId = req.user.id;

  const schedule = await Schedule.findOne({
    _id: scheduleId,
    doctor: doctorId,
  });

  if (!schedule) {
    res.status(404);
    throw new Error('Appointment not found!');
  }
  res.json(schedule);
});

//@desc UPDATE DOCTOR'S SCHEDULE
//@route PUT /api/doctor/schedule/:id
//@access private (doctor only)
const updateDoctorSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const scheduleId = req.params.id;
  const updatedFields = req.body;

  const schedule = await Schedule.findOne({
    _id: scheduleId,
    doctor: doctorId,
  });

  if (!schedule) {
    res.status(404);
    throw new Error('Doctor schedule not found or unauthorized!');
  }

  const session = await Schedule.startSession(sessionOptions);
  try{
    session.startTransaction();

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      updatedFields,
      { new: true, runValidators: true, session }
    );

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'update',
      entity: 'Schedule',
      entityId: scheduleId,
      oldValues: schedule,
      newValues: updatedSchedule,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'Doctor schedule updated'
      }],
      { session }
    );
    await session.commitTransaction(); 
    res.json(updatedSchedule);
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();
});

//@desc DELETE DOCTOR'S SCHEDULE
//@route DELETE /api/doctor/schedule/:id
//@access private (doctor only)
const deleteDoctorSchedule = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const scheduleId = req.params.id;

  const session = await Schedule.startSession(sessionOptions);
  try{
    session.startTransaction();

    const schedule = await Schedule.findOneAndDelete(
    {
      _id: scheduleId,
      doctor: doctorId,
    },
    { session });

    if (!schedule) {
      res.status(404);
      throw new Error('Doctor schedule not found or unauthorized!');
    }

    await AuditLog.create(
      [{
      userId: req.user.id,
      operation: 'delete',
      entity: 'Schedule',
      entityId: scheduleId,
      oldValues: schedule,
      newValues: null,
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'Doctor schedule deleted'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json('Doctor appointment deleted successfully');
  }
  catch(error){
    await session.abortTransaction();
    throw error
  }
  session.endSession();  
});

/**
##### ORDERS (CRUD) #####
**/

//@desc CREATE ORDER FOR GLASSES/LENSES
//@route POST /api/doctor/order/:id
//@access private (doctor only)
const createOrder = asyncHandler(async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const doctorId = req.user.id;
  const patientId = req.params.id;
  const session = await Order.startSession(sessionOptions);
  try{
    session.startTransaction();
    const orderDetails = await Order.create(
    [{
      doctor: doctorId,
      dayOfWeek,
      startTime,
      endTime,
    }],
    { session });

    await AuditLog.create(
      [{
      userId: doctorId,
      operation: 'create',
      entity: 'Schedule',
      entityId: doctorSchedule[0]._id,
      oldValues: null,
      newValues: doctorSchedule[0],
      userIpAddress: req.ip,
      userAgent: req.get('user-agent'),
      additionalInfo: 'New doctor schedule added'
      }],
      { session }
    );
    await session.commitTransaction();
    res.status(201).json(doctorSchedule);
  } 
  catch(error){
    await session.abortTransaction();
    throw error;
  }
  session.endSession(); 
});





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
  deleteAppointment,

  addDoctorSchedule,
  getDoctorSchedule,
  getScheduleDetails,
  updateDoctorSchedule,
  deleteDoctorSchedule
};
