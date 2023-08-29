const asyncHandler = require("express-async-handler");
const AuditLog = require("../models/auditLogModel");

const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const EyeRecord = require("../models/eyeRecordsModel");
const Appointment = require("../models/appointmentModel");
const Schedule = require("../models/scheduleModel");
const Order = require("../models/orderModel");

const sessionOptions = {
	readConcern: { level: "snapshot" },
	writeConcern: { w: "majority" },
};

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
##### ORDER (CRUD) #####
**/

//@desc ADDS A NEW ORDER
//@route POST /api/doctor/order
//@access private (doctor only)
const createOrder = asyncHandler(async (req, res) => {
	const doctorId = req.user.id;
	const {
		patient,
		orderTime,
		status,
		frame,
		lens,
		frameQuantity,
		lensQuantity,
		otherItems,
		amount,
	} = req.body;

	const existingPatient = await User.findById(patient);

	if (!existingPatient) {
		return res.status(404).json({ message: "Patient not found!" });
	}

	const session = await Order.startSession(sessionOptions);
	try {
		session.startTransaction();
		const order = await Order.create(
			[
				{
					doctor: doctorId,
					patient: patient,
					orderTime,
					status,
					frame,
					lens,
					frameQuantity,
					lensQuantity,
					otherItems,
					amount,
				},
			],
			{ session }
		);

		await AuditLog.create(
			[
				{
					userId: doctorId,
					operation: "create",
					entity: "Order",
					entityId: order[0]._id,
					oldValues: null,
					newValues: order[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New order added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: order,
			message: `Order with id ${order._id} is successfully created!`,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			return res.status(400).json({ message: validationErrors });
		}

		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
		return res.status(400).json({ message: error });
	}
	session.endSession();
});

//@desc GET ALL THE ORDERS MADE BY THE DOCTOR
//@route GET /api/doctor/order
//@access private (doctor only)
const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ doctor: req.user.id });
	if (orders == {}) {
		res.json({ message: "No orders for doctor is currently saved." });
	}
	res.json(orders);
});

//@desc GET DETAILS OF ORDER
//@route GET /api/doctor/order/:id
//@access private (doctor only)
const getOrderDetails = asyncHandler(async (req, res) => {
	const orderId = req.params.id;
	const doctorId = req.user.id;

	const order = await Order.findOne({
		_id: orderId,
		doctor: doctorId,
	});

	if (!order) {
		return res.status(404).json({ message: "Order not found!" });
	}
	res.json(order);
});

//@desc UPDATES AN ORDER
//@route PUT /api/doctor/order/:id
//@access private (doctor only)
const updateOrder = asyncHandler(async (req, res) => {
	const doctorId = req.user.id;
	const orderId = req.params.id;
	const updates = req.body;

	const order = await Order.findOne({
		_id: orderId,
		doctor: doctorId,
	});

	if (!order) {
		return res
			.status(404)
			.json({ message: "Order not found or unauthorized!" });
	}

	const session = await Order.startSession(sessionOptions);
	try {
		session.startTransaction();
		const updatedOrder = await Order.findByIdAndUpdate(doctorId, updates, {
			new: true,
			runValidators: true,
			session,
		});

		await AuditLog.create(
			[
				{
					userId: doctorId,
					operation: "update",
					entity: "Order",
					entityId: orderId,
					oldValues: order,
					newValues: updatedOrder,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Order updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedOrder,
			message: `Order with id ${orderId} is successfully updated!`,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			return res.status(400).json({ message: validationErrors });
		}

		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
		return res.status(400).json({ message: error });
	}
	session.endSession();
});

//@desc DELETES AN ORDER
//@route DELETE /api/doctor/order/:id
//@access private (doctor only)
const deleteOrder = asyncHandler(async (req, res) => {
	const doctorId = req.user.id;
	const orderId = req.params.id;

	const session = await Order.startSession(sessionOptions);
	try {
		session.startTransaction();

		const order = await Order.findOneAndDelete(
			{
				_id: orderId,
				doctor: doctorId,
			},
			{ session }
		);

		if (!order) {
			return res
				.status(404)
				.json({ message: "Order not found or unauthorized!" });
		}

		await AuditLog.create(
			[
				{
					userId: doctorId,
					operation: "delete",
					entity: "Order",
					entityId: orderId,
					oldValues: order,
					newValues: null,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Order deleted",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			id: orderId,
			message: `Order with id ${orderId} successfully deleted!`,
		});
	} catch (error) {
		await session.abortTransaction();
		throw error;
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
		return res.status(404).json({ message: "Patient not found!" });
	}

	const session = await EyeRecord.startSession(sessionOptions);
	try {
		session.startTransaction();

		const eyeRecord = await EyeRecord.create(
			[
				{
					doctor: req.user.id,
					patientId: patient._id,
					rightEye,
					leftEye,
					additionalNotes,
				},
			],
			{ session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "create",
					entity: "EyeRecord",
					entityId: eyeRecord[0]._id,
					oldValues: null,
					newValues: eyeRecord[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New eye record added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: eyeRecord,
			message: `Patient ${patient.personalInfo.fname} ${patient.personalInfo.lname} eye record successfully added!`,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			return res.status(400).json({ message: validationErrors });
		}
		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
		throw error;
	}
	session.endSession();
});

//@desc GET ALL THE RECORDS MADE BY THE DOCTOR
//@route GET /api/doctor/records
//@access private (doctor only)
const getAllRecords = asyncHandler(async (req, res) => {
	const records = await EyeRecord.find({ doctor: req.user.id });
	if (records == {}) {
		res.json({ message: "No eye records for doctor is currently saved." });
	}
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
		return res.status(404).json({ message: "Transaction not found!" });
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
		return res
			.status(404)
			.json({ message: "Record not found or unauthorized!" });
	}

	const session = await EyeRecord.startSession(sessionOptions);
	try {
		session.startTransaction();

		const updatedRecord = await EyeRecord.findByIdAndUpdate(
			recordId,
			updatedFields,
			{ new: true, runValidators: true, session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "update",
					entity: "EyeRecord",
					entityId: recordId,
					oldValues: record,
					newValues: updatedRecord,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Eye Record updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedRecord,
			message: `Eye Record with id ${record._id} successfully updated!`,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			return res.status(400).json({ message: validationErrors });
		}
		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
		throw error;
	}
	session.endSession();
});

//@desc DELETES EYE RECORD
//@route DELETE /api/doctor/records/:id
//@access private (doctor only)
const deleteRecord = asyncHandler(async (req, res) => {
	const doctorId = req.user.id;
	const recordId = req.params.id;

	const session = await EyeRecord.startSession(sessionOptions);
	try {
		session.startTransaction();

		const record = await EyeRecord.findOneAndDelete(
			{
				_id: recordId,
				doctor: doctorId,
			},
			{ session }
		);

		if (!record) {
			return res
				.status(404)
				.json({ message: "Record not found or unauthorized!" });
		}

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "delete",
					entity: "EyeRecord",
					entityId: recordId,
					oldValues: record,
					newValues: null,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Eye Record deleted",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res
			.status(201)
			.json({ id: recordId, message: "Record deleted successfully" });
	} catch (error) {
		await session.abortTransaction();
		throw error;
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
		return res.status(404).json({ message: "Patient not found!" });
	}

	const session = await Appointment.startSession(sessionOptions);
	try {
		session.startTransaction();

		const appointment = await Appointment.create(
			[
				{
					doctor: doctorId,
					patient: patientId,
					date,
					startTime,
					endTime,
					notes,
				},
			],
			{ session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "create",
					entity: "Appointment",
					entityId: appointment[0]._id,
					oldValues: null,
					newValues: appointment[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New appointment added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: appointment,
			message: `Appointment with id ${appointment._id} at ${appointment.date} successfully added!`,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			return res.status(400).json({ message: validationErrors });
		}
		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
		throw error;
	}
	session.endSession();
};

//@desc GET LIST OF DOCTOR'S APPOINTMENTS
//@route GET /api/doctor/appointments
//@access private (doctor only)
const getAllAppointments = asyncHandler(async (req, res) => {
	const appointment = await Appointment.find({ doctor: req.user.id });
	if (appointment == {}) {
		res.json({ message: "No appointments currently scheduled." });
	}
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
		return res.status(404).json({ message: "Appointment not found!" });
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
		return res
			.status(404)
			.json({ message: "Appointment not found or unauthorized!" });
	}

	const session = await Appointment.startSession(sessionOptions);
	try {
		session.startTransaction();

		const updatedAppointment = await Appointment.findByIdAndUpdate(
			appointmentId,
			updatedFields,
			{ new: true, runValidators: true, session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "update",
					entity: "Appointment",
					entityId: appointmentId,
					oldValues: appointment,
					newValues: updatedAppointment,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Appointment updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedAppointment,
			message: `Appointment with id ${appointmentId} at ${appointment.date} successfully updated!`,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			return res.status(400).json({ message: validationErrors });
		}
		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
		throw error;
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
	try {
		session.startTransaction();

		const appointment = await Appointment.findOneAndDelete(
			{
				_id: appointmentId,
				doctor: doctorId,
			},
			{ session }
		);

		if (!appointment) {
			return res
				.status(404)
				.json({ message: "Appointment not found or unauthorized!" });
		}

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "delete",
					entity: "Appointment",
					entityId: appointmentId,
					oldValues: appointment,
					newValues: null,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Appointment deleted",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res
			.status(201)
			.json({ id: appointmentId, message: "Appointment deleted successfully" });
	} catch (error) {
		await session.abortTransaction();
		throw error;
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

	if (!dayOfWeek || !startTime || endTime) {
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const schedule = await Schedule.findOne({
		doctor: doctorId,
		dayOfWeek: dayOfWeek,
	});
	if (schedule) {
		return res.status(400).json({ message: "Schedule already exists!" });
	}

	const session = await Schedule.startSession(sessionOptions);
	try {
		session.startTransaction();
		const doctorSchedule = await Schedule.create(
			[
				{
					doctor: doctorId,
					dayOfWeek,
					startTime,
					endTime,
				},
			],
			{ session }
		);

		await AuditLog.create(
			[
				{
					userId: doctorId,
					operation: "create",
					entity: "Schedule",
					entityId: doctorSchedule[0]._id,
					oldValues: null,
					newValues: doctorSchedule[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New doctor schedule added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: doctorSchedule,
			message: `Schedule for ${dayOfWeek} successfully added!.`,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			return res.status(400).json({ message: validationErrors });
		}

		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
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
	if (doctorSchedules == {}) {
		res.json({ message: "No schedule currently added." });
	}
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
		return res.status(404).json({ message: "Schedule not found!" });
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
		return res
			.status(404)
			.json({ message: "Doctor schedule not found or unauthorized!" });
	}

	const session = await Schedule.startSession(sessionOptions);
	try {
		session.startTransaction();

		const updatedSchedule = await Schedule.findByIdAndUpdate(
			scheduleId,
			updatedFields,
			{ new: true, runValidators: true, session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "update",
					entity: "Schedule",
					entityId: scheduleId,
					oldValues: schedule,
					newValues: updatedSchedule,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Doctor schedule updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.json({
			data: updatedSchedule,
			message: `Schedule for ${dayOfWeek} successfully updated!`,
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			return res.status(400).json({ message: validationErrors });
		}

		if (session) {
			await session.abortTransaction();
			session.endSession();
		}
		throw error;
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
	try {
		session.startTransaction();

		const schedule = await Schedule.findOneAndDelete(
			{
				_id: scheduleId,
				doctor: doctorId,
			},
			{ session }
		);

		if (!schedule) {
			return res
				.status(404)
				.json({ message: "Doctor schedule not found or unauthorized!" });
		}

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "delete",
					entity: "Schedule",
					entityId: scheduleId,
					oldValues: schedule,
					newValues: null,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Doctor schedule deleted",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			id: scheduleId,
			message: "Doctor appointment deleted successfully",
		});
	} catch (error) {
		await session.abortTransaction();
		throw error;
	}
	session.endSession();
});

module.exports = {
	createOrder,
	getAllOrders,
	getOrderDetails,
	updateOrder,
	deleteOrder,

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
	deleteDoctorSchedule,
};
