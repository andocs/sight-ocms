const asyncHandler = require("express-async-handler");
const AuditLog = require("../models/auditLogModel");

const EyeRecord = require("../models/eyeRecordsModel");
const Order = require("../models/orderModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const Schedule = require("../models/scheduleModel");
const Repair = require("../models/repairModel");

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
		{
			$sort: {
				createdAt: -1,
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
		{
			$sort: {
				orderTime: -1,
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
	const { doctor, appointmentDate, appointmentStart, appointmentEnd } =
		req.body;

	if (!appointmentDate || !appointmentStart || !appointmentEnd) {
		return res
			.status(404)
			.json({ message: "Please fill in all the required fields!" });
	}

	const appointmentData = {
		patient: patientId,
		appointmentDate,
		appointmentStart,
		appointmentEnd,
	};
	if (doctor) {
		appointmentData.doctor = doctor;
		appointmentData.status = "Scheduled";
	}

	const session = await Appointment.startSession(sessionOptions);
	try {
		session.startTransaction();

		const appointment = await Appointment.create([appointmentData], {
			session,
		});

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
		{
			$sort: {
				appointmentDate: -1,
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
		{
			$sort: {
				appointmentDate: -1,
			},
		},
	]);
	res.json(appointment);
});

//@desc GET LIST OF DOCTOR'S PENDING APPOINTMENTS
//@route GET /api/patient/confirmed
//@access private (patient only)
const getConfirmedAppointments = asyncHandler(async (req, res) => {
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
				status: "Confirmed",
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
		{
			$sort: {
				appointmentDate: -1,
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

/**
##### STAFF (READ ONLY) #####
**/

//@desc GET LIST OF ALL STAFF
//@route GET /api/patient/doctor
//@access private (patient only)
const getDoctorList = asyncHandler(async (req, res) => {
	const staff = await User.find({ role: "doctor" });
	res.json(staff);
});

//@desc GET LIST OF DOCTOR'S SCHEDULE
//@route GET /api/patient/schedule
//@access private (patient only)
const getDoctorSchedule = asyncHandler(async (req, res) => {
	const allSchedules = await Schedule.find({ breaks: { $exists: false } });

	const schedulesByDoctor = {};

	for (const schedules of allSchedules) {
		const doctorId = schedules.doctor;
		if (!schedulesByDoctor[doctorId]) {
			schedulesByDoctor[doctorId] = {
				id: doctorId,
				name: "",
				email: "",
				contact: "",
				schedule: [],
				appointments: [],
				breaks: [],
			};
		}
		const userDetails = await User.findOne({ _id: doctorId });
		if (userDetails) {
			const { personalInfo } = userDetails;
			schedulesByDoctor[
				doctorId
			].name = `${personalInfo.fname} ${personalInfo.lname}`;
			schedulesByDoctor[doctorId].contact = `${personalInfo.contact}`;
			schedulesByDoctor[doctorId].email = userDetails.email;
		}

		schedulesByDoctor[doctorId].schedule.push(schedules);
	}

	for (const doctorId in schedulesByDoctor) {
		const currentDate = new Date();
		const appointments = await Appointment.find({
			doctor: doctorId,
			status: { $in: ["Scheduled", "Confirmed"] },
			appointmentDate: { $gte: currentDate },
		});
		schedulesByDoctor[doctorId].appointments = appointments;

		const breaks = await Schedule.findOne({
			doctor: doctorId,
			breaks: { $exists: true, $ne: [] },
		});
		const allBreaks = breaks?.breaks || [];
		if (allBreaks.length === 0) {
			schedulesByDoctor[doctorId].breaks = allBreaks;
		} else {
			allBreaks.sort((a, b) => {
				const dateA = new Date(a.startDate);
				const dateB = new Date(b.startDate);
				return dateA - dateB;
			});

			// Filter breaks greater than or equal to current date
			const breaksFromToday = allBreaks.filter((breakItem) => {
				const breakStartDate = new Date(breakItem.startDate);
				return breakStartDate >= currentDate;
			});

			schedulesByDoctor[doctorId].breaks = breaksFromToday;
		}
	}

	const schedule = Object.values(schedulesByDoctor);

	for (const doctorSchedule of schedule) {
		const daysOfWeek = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		];
		doctorSchedule.schedule.sort((a, b) => {
			const dayA = daysOfWeek.indexOf(a.dayOfWeek);
			const dayB = daysOfWeek.indexOf(b.dayOfWeek);
			return dayA - dayB;
		});
	}

	res.json(schedule);
});

/**
##### REPAIR (READ ONLY) #####
**/

//@desc GET LIST OF PATIENT'S REPAIRS
//@route GET /api/patient/repair
//@access private (patient only)
const getRepairHistory = asyncHandler(async (req, res) => {
	const patientId = new ObjectId(req.user.id);
	const repairList = await Repair.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "technician",
				foreignField: "_id",
				as: "userDetails",
			},
		},
		{
			$lookup: {
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "docDetails",
			},
		},
		{
			$match: { patient: patientId },
		},
		{
			$project: {
				createdAt: 1,
				acceptTime: 1,
				completeTime: 1,
				docLastName: { $arrayElemAt: ["$docDetails.personalInfo.lname", 0] },
				docFirstName: { $arrayElemAt: ["$docDetails.personalInfo.fname", 0] },
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				status: 1,
				itemType: 1,
				amount: 1,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);
	res.json(repairList);
});

//@desc GET REPAIR REQUEST DETAILS
//@route GET /api/patient/repair/:id
//@access private (patient only)
const getRepairDetails = asyncHandler(async (req, res) => {
	const requestId = req.params.id;

	const request = await Repair.findOne({
		_id: requestId,
	});

	if (!request) {
		return res.status(404).json({ message: "Request not found!" });
	}
	res.json(request);
});

module.exports = {
	getRecords,
	getRecordDetails,

	getAllOrders,
	getOrderDetails,

	scheduleAppointment,
	getAllAppointments,
	getConfirmedAppointments,
	getPendingAppointments,
	getAppointmentDetails,

	getDoctorList,
	getDoctorSchedule,

	getRepairHistory,
	getRepairDetails,
};
