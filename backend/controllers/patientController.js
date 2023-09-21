const asyncHandler = require("express-async-handler");
const AuditLog = require("../models/auditLogModel");

const EyeRecord = require("../models/eyeRecordsModel");
const Order = require("../models/orderModel");
const Appointment = require("../models/appointmentModel");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const sessionOptions = {
	readConcern: { level: "snapshot" },
	writeConcern: { w: "majority" },
};

/**
##### EYE RECORDS (READ ONLY) #####
**/

//@desc GET LIST OF PATIENT'S EYE RECORDS
//@route GET /api/patient/records
//@access Private (patient only)
const getRecords = asyncHandler(async (req, res) => {
	const patientId = new ObjectId(req.user.id);
	const records = await EyeRecord.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "doctorDetails",
			},
		},
		{
			$match: {
				patient: patientId,
			},
		},
		{
			$project: {
				createdAt: 1,
				doctorLastName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.lname", 0],
				},
				doctorFirstName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.fname", 0],
				},
				rightEye: 1,
				leftEye: 1,
			},
		},
	]);
	res.json(records);
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

//@desc GET ALL THE ORDERS MADE BY THE DOCTOR
//@route GET /api/patient/order
//@access private (patient only)
const getAllOrders = asyncHandler(async (req, res) => {
	const patientId = new ObjectId(req.user.id);
	const orders = await Order.aggregate([
		{
			$match: {
				patient: patientId,
			},
		},
		{
			$lookup: {
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "doctorDetails",
			},
		},
		{
			$lookup: {
				from: "userDetails",
				localField: "technician",
				foreignField: "_id",
				as: "technicianDetails",
			},
		},
		{
			$lookup: {
				from: "inventoryDetails",
				localField: "lens",
				foreignField: "_id",
				as: "lensDetails",
			},
		},
		{
			$lookup: {
				from: "inventoryDetails",
				localField: "frame",
				foreignField: "_id",
				as: "frameDetails",
			},
		},
		{
			$lookup: {
				from: "inventoryDetails",
				localField: "otherItems.item",
				foreignField: "_id",
				as: "itemDetails",
			},
		},

		{
			$project: {
				orderTime: 1,
				status: 1,
				amount: 1,
				doctorLastName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.lname", 0],
				},
				doctorFirstName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.fname", 0],
				},
				technicianLastName: {
					$arrayElemAt: ["$technicianDetails.personalInfo.lname", 0],
				},
				technicianFirstName: {
					$arrayElemAt: ["$technicianDetails.personalInfo.fname", 0],
				},
				lens: 1,
				lensName: { $arrayElemAt: ["$lensDetails.itemName", 0] },
				lensPrice: 1,
				lensQuantity: 1,
				frame: 1,
				frameName: { $arrayElemAt: ["$frameDetails.itemName", 0] },
				framePrice: 1,
				frameQuantity: 1,
				otherItems: 1,
			},
		},
	]);
	res.json(orders);
});

//@desc GET DETAILS OF ORDER
//@route GET /api/patient/order/:id
//@access private (patient only)
const getOrderDetails = asyncHandler(async (req, res) => {
	const orderId = new ObjectId(req.params.id);
	const patientId = new ObjectId(req.user.id);

	const order = await Order.aggregate([
		{
			$match: {
				patient: patientId,
				_id: orderId,
			},
		},
		{
			$lookup: {
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "doctorDetails",
			},
		},
		{
			$lookup: {
				from: "userDetails",
				localField: "technician",
				foreignField: "_id",
				as: "technicianDetails",
			},
		},
		{
			$lookup: {
				from: "inventoryDetails",
				localField: "lens",
				foreignField: "_id",
				as: "lensDetails",
			},
		},
		{
			$lookup: {
				from: "inventoryDetails",
				localField: "frame",
				foreignField: "_id",
				as: "frameDetails",
			},
		},
		{
			$lookup: {
				from: "inventoryDetails",
				localField: "otherItems.item",
				foreignField: "_id",
				as: "itemDetails",
			},
		},
		{
			$project: {
				orderTime: 1,
				status: 1,
				amount: 1,
				doctorLastName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.lname", 0],
				},
				doctorFirstName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.fname", 0],
				},
				technicianLastName: {
					$arrayElemAt: ["$technicianDetails.personalInfo.lname", 0],
				},
				technicianFirstName: {
					$arrayElemAt: ["$technicianDetails.personalInfo.fname", 0],
				},
				lens: 1,
				lensName: { $arrayElemAt: ["$lensDetails.itemName", 0] },
				lensPrice: 1,
				lensQuantity: 1,
				frame: 1,
				frameName: { $arrayElemAt: ["$frameDetails.itemName", 0] },
				framePrice: 1,
				frameQuantity: 1,
				otherItems: 1,
			},
		},
	]);

	if (!order) {
		return res.status(404).json({ message: "Order not found!" });
	}
	if (order) {
		res.json(order[0]);
	}
});

/**
##### APPOINTMENTS (CREATE, READ (UPDATE DELETE *)) #####
**/

//@desc ADDS APPOINTMENT (MAINLY FOLLOW UPS)
//@route POST /api/patient/appointments/:id
//@access private (patient only)
const scheduleAppointment = async (req, res) => {
	const patientId = req.user.id;
	const { appointmentDate, appointmentStart, appointmentEnd } = req.body;

	if (!appointmentDate || !appointmentStart || !appointmentEnd) {
		return res
			.status(404)
			.json({ message: "Please fill in all the required fields!" });
	}

	const session = await Appointment.startSession(sessionOptions);
	try {
		session.startTransaction();

		const appointment = await Appointment.create(
			[
				{
					patient: patientId,
					appointmentDate,
					appointmentStart,
					appointmentEnd,
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
			message: `Appointment on ${appointmentDate} successfully added!`,
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
//@route GET /api/patient/appointments
//@access private (patient only)
const getAllAppointments = asyncHandler(async (req, res) => {
	const patientId = new ObjectId(req.user.id);
	const appointment = await Appointment.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "doctorDetails",
			},
		},
		{
			$match: {
				patient: patientId,
			},
		},
		{
			$project: {
				appointmentDate: 1,
				doctorLastName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.lname", 0],
				},
				doctorFirstName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.fname", 0],
				},
				appointmentStart: 1,
				appointmentEnd: 1,
				notes: 1,
				status: 1,
			},
		},
	]);
	res.json(appointment);
});

//@desc GET LIST OF DOCTOR'S PENDING APPOINTMENTS
//@route GET /api/patient/pending
//@access private (patient only)
const getPendingAppointments = asyncHandler(async (req, res) => {
	const patientId = new ObjectId(req.user.id);
	const appointment = await Appointment.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "doctorDetails",
			},
		},
		{
			$match: {
				patient: patientId,
				status: "Pending",
			},
		},
		{
			$project: {
				appointmentDate: 1,
				doctorLastName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.lname", 0],
				},
				doctorFirstName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.fname", 0],
				},
				appointmentStart: 1,
				appointmentEnd: 1,
				notes: 1,
				status: 1,
			},
		},
	]);
	res.json(appointment);
});

//@desc GET APPOINTMENT DETAILS
//@route GET /api/patient/appointments/:id
//@access private (patient only)
const getAppointmentDetails = asyncHandler(async (req, res) => {
	const appointmentId = req.params.id;
	const patientId = req.user.id;

	const appointment = await Appointment.findOne({
		_id: appointmentId,
		patient: patientId,
	});

	if (!appointment) {
		return res.status(404).json({ message: "Appointment not found!" });
	}
	res.json(appointment);
});

module.exports = {
	getRecords,
	getRecordDetails,

	getAllOrders,
	getOrderDetails,

	scheduleAppointment,
	getAllAppointments,
	getPendingAppointments,
	getAppointmentDetails,
};
