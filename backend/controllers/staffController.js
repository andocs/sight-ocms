const asyncHandler = require("express-async-handler");

const AuditLog = require("../models/auditLogModel");

const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const Visit = require("../models/visitModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const sessionOptions = {
	readConcern: { level: "snapshot" },
	writeConcern: { w: "majority" },
};

/**
##### APPOINTMENT (READ & UPDATE) #####
**/

//@desc GET LIST OF APPOINTMENTS
//@route GET /api/staff/appointments
//@access private (staff only)
const getAllAppointments = asyncHandler(async (req, res) => {
	const currentDate = new Date();
	const appointment = await Appointment.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "patient",
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
			$match: {
				appointmentDate: { $gte: currentDate },
			},
		},
		{
			$project: {
				appointmentDate: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				docLastName: { $arrayElemAt: ["$docDetails.personalInfo.lname", 0] },
				docFirstName: { $arrayElemAt: ["$docDetails.personalInfo.fname", 0] },
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

//@desc GET LIST OF PENDING APPOINTMENTS
//@route GET /api/staff/pending
//@access private (staff only)
const getPendingAppointments = asyncHandler(async (req, res) => {
	const currentDate = new Date();
	const appointment = await Appointment.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "patient",
				foreignField: "_id",
				as: "userDetails",
			},
		},
		{
			$match: {
				doctor: null,
				status: "Pending",
				appointmentDate: { $gte: currentDate },
			},
		},
		{
			$project: {
				appointmentDate: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
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

//@desc GET LIST OF SCHEDULED APPOINTMENTS
//@route GET /api/staff/scheduled
//@access private (staff only)
const getScheduledAppointments = asyncHandler(async (req, res) => {
	const currentDate = new Date();
	const appointment = await Appointment.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "patient",
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
			$match: {
				status: "Scheduled",
				appointmentDate: {
					$gte: currentDate,
				},
			},
		},
		{
			$project: {
				appointmentDate: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				docLastName: { $arrayElemAt: ["$docDetails.personalInfo.lname", 0] },
				docFirstName: { $arrayElemAt: ["$docDetails.personalInfo.fname", 0] },
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

//@desc GET LIST OF CONFIRMED APPOINTMENTS
//@route GET /api/staff/confirmed
//@access private (staff only)
const getConfirmedAppointments = asyncHandler(async (req, res) => {
	const currentDate = new Date();
	const appointment = await Appointment.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "patient",
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
			$match: {
				status: "Confirmed",
				appointmentDate: {
					$gte: currentDate,
				},
			},
		},
		{
			$project: {
				appointmentDate: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				docLastName: { $arrayElemAt: ["$docDetails.personalInfo.lname", 0] },
				docFirstName: { $arrayElemAt: ["$docDetails.personalInfo.fname", 0] },
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
//@route GET /api/staff/appointments/:id
//@access private (staff only)
const getAppointmentDetails = asyncHandler(async (req, res) => {
	const appointmentId = req.params.id;

	const appointment = await Appointment.findOne({
		_id: appointmentId,
	});

	if (!appointment) {
		return res.status(404).json({ message: "Appointment not found!" });
	}
	res.json(appointment);
});

//@desc UPDATES APPOINTMENT DETAILS
//@route PUT /api/staff/appointments/:id
//@access private (staff only)
const updateAppointment = async (req, res) => {
	const staffId = req.user.id;
	const appointmentId = req.params.id;
	const updatedFields = req.body;

	const appointment = await Appointment.findOne({
		_id: appointmentId,
	});

	if (!appointment) {
		return res
			.status(404)
			.json({ message: "Appointment not found or unauthorized!" });
	}

	if (updatedFields.status === "Confirmed") {
		updatedFields.staff = staffId;
	}

	if (updatedFields.status === "Cancelled") {
		updatedFields.staff = staffId;
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
			message: `Appointment with id ${appointmentId} at ${appointment.appointmentDate} successfully updated!`,
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

/**
##### VISIT (READ) #####
**/

//@desc GET LIST OF ALL VISITS
//@route GET /api/staff/visit
//@access private (staff only)
const getVisitList = asyncHandler(async (req, res) => {
	const visits = await Visit.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "patient",
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
			$project: {
				visitDate: 1,
				patientType: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				docLastName: { $arrayElemAt: ["$docDetails.personalInfo.lname", 0] },
				docFirstName: { $arrayElemAt: ["$docDetails.personalInfo.fname", 0] },
				visitType: 1,
				reason: 1,
				additionalInfo: 1,
			},
		},
		{
			$sort: {
				visitDate: -1,
			},
		},
	]);
	res.json(visits);
});

//@desc GET VISIT RECORD DETAILS
//@route GET /api/staff/visit/:id
//@access private (staff only)
const getVisitDetails = asyncHandler(async (req, res) => {
	const visitId = req.params.id;
	const visit = await Visit.findById(visitId);
	if (!visit) {
		return res.status(404).json({ message: "Visit Record not found!" });
	}
	res.json(visit);
});

/**
##### PATIENT (READ) #####
**/

//@desc GET ALL THE PATIENTS
//@route GET /api/staff/patient
//@access private (staff only)
const getAllPatients = asyncHandler(async (req, res) => {
	const patients = await User.find({ role: "patient" });
	if (patients == {}) {
		res.json({ message: "No patients currently saved in the system." });
	}
	res.json(patients);
});

//@desc GET PATIENT DETAILS
//@route GET /api/staff/patient/:id
//@access Private (staff only)
const getPatientDetails = asyncHandler(async (req, res) => {
	const patientId = req.params.id;
	const patient = await User.findById(patientId);
	if (!patient) {
		return res.status(404).json({ message: "User not found." });
	}
	res.json(patient);
});

//@desc GET PATIENT HISTORY
//@route GET /api/staff/patient/history/:id
//@access Private (staff only)
const getPatientHistory = asyncHandler(async (req, res) => {
	const patientId = new ObjectId(req.params.id);
	const patient = await User.findById(patientId);
	if (!patient) {
		return res.status(404).json({ message: "User not found." });
	}
	const history = [];
	history.push({ patient });

	const visit = await Visit.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "userDetails",
			},
		},
		{
			$match: {
				patient: patientId,
			},
		},
		{
			$project: {
				visitDate: 1,
				patientType: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				visitType: 1,
				reason: 1,
				additionalInfo: -1,
			},
		},
	]);
	history.push({ visit });

	const appointments = await Appointment.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "userDetails",
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
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
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
	history.push({ appointments });

	res.json(history);
});

module.exports = {
	getAllAppointments,
	getPendingAppointments,
	getScheduledAppointments,
	getConfirmedAppointments,
	getAppointmentDetails,
	updateAppointment,

	getVisitList,
	getVisitDetails,

	getAllPatients,
	getPatientDetails,
	getPatientHistory,
};
