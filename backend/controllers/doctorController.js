const asyncHandler = require("express-async-handler");

const AuditLog = require("../models/auditLogModel");

const User = require("../models/userModel");
const EyeRecord = require("../models/eyeRecordsModel");
const Appointment = require("../models/appointmentModel");
const Schedule = require("../models/scheduleModel");
const Order = require("../models/orderModel");
const Visit = require("../models/visitModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Inventory = require("../models/inventoryModel");

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
##### PATIENT (CREATE & READ) #####
**/

//@desc ADDS A NEW PATIENT
//@route POST /api/doctor/patient
//@access private (doctor only)

const createPatient = asyncHandler(async (req, res) => {
	const { fname, lname, gender, email, contact, address, city, province } =
		req.body;
	console.log(req.body);

	if (!email || !contact) {
		return res.status(404).json({ message: "Email or Contact required!" });
	}

	// const existingPatient = await User.find({
	// 	$or: [{ email: email }, { "personalInfo.contact": contact }],
	// });

	const existingPatient = await User.findOne({ email });

	if (existingPatient) {
		return res.status(404).json({ message: "Patient already exists!" });
	}

	const personalInfo = {
		fname,
		lname,
		gender,
		contact,
		address,
		city,
		province,
	};

	let isComplete = false;
	if (
		personalInfo.fname &&
		personalInfo.lname &&
		personalInfo.gender &&
		personalInfo.contact &&
		personalInfo.address &&
		personalInfo.city &&
		personalInfo.province
	) {
		isComplete = true;
	}

	const session = await User.startSession(sessionOptions);
	try {
		session.startTransaction();
		const patient = await User.create(
			[
				{
					email,
					isRegistered: false,
					role: "patient",
					isPersonalInfoComplete: isComplete,
					personalInfo,
				},
			],
			{ session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "create",
					entity: "User",
					entityId: patient[0]._id,
					oldValues: null,
					newValues: patient[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New patient added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: patient,
			message: `Patient ${fname} ${lname} is successfully added!`,
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

//@desc GET ALL THE PATIENTS
//@route GET /api/doctor/patient
//@access private (doctor only)
const getAllPatients = asyncHandler(async (req, res) => {
	const patients = await User.find({ role: "patient" });
	if (patients == {}) {
		res.json({ message: "No patients currently saved in the system." });
	}
	res.json(patients);
});

//@desc GET PATIENT DETAILS
//@route GET /api/doctor/patient/:id
//@access Private (doctor only)
const getPatientDetails = asyncHandler(async (req, res) => {
	const patientId = req.params.id;
	const patient = await User.findById(patientId);
	if (!patient) {
		return res.status(404).json({ message: "User not found." });
	}
	res.json(patient);
});

/**
##### VISIT (CRUD) #####
**/

//@desc ADD NEW VISIT RECORD
//@route POST /api/doctor/visit/:id
//@access Private (doctor only)
const createVisit = asyncHandler(async (req, res) => {
	const doctorId = req.user.id;
	const patientId = req.params.id;
	const { patientType, visitType, reason, medicalHistory, additionalInfo } =
		req.body;

	const existingPatient = await User.findById(patientId);

	if (!existingPatient) {
		return res.status(404).json({ message: "Patient not found!" });
	}

	if (!patientType || !visitType || !reason) {
		return res
			.status(404)
			.json({ message: "Please fill in all the required fields!" });
	}

	const session = await Visit.startSession(sessionOptions);
	try {
		session.startTransaction();
		const visit = await Visit.create(
			[
				{
					doctor: doctorId,
					patient: patientId,
					patientType,
					visitDate: new Date(),
					visitType,
					reason,
					medicalHistory,
					additionalInfo,
				},
			],
			{ session }
		);

		await AuditLog.create(
			[
				{
					userId: doctorId,
					operation: "create",
					entity: "Visit",
					entityId: visit[0]._id,
					oldValues: null,
					newValues: visit[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New visit record added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: visit,
			message: `Patient ${existingPatient.personalInfo.fname} ${existingPatient.personalInfo.lname}'s visit record is successfully created!`,
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

//@desc GET LIST OF ALL VISITS WITH DOCTOR
//@route GET /api/doctor/visit
//@access private (doctor only)
const getVisitList = asyncHandler(async (req, res) => {
	const doctorId = new ObjectId(req.user.id);

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
			$match: {
				doctor: doctorId,
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
				additionalInfo: 1,
			},
		},
	]);
	res.json(visits);
});

//@desc GET VISIT RECORD DETAILS
//@route GET /api/doctor/visit/:id
//@access private (doctor only)
const getVisitDetails = asyncHandler(async (req, res) => {
	const visitId = req.params.id;
	const visit = await Visit.findById(visitId);
	if (!visit) {
		return res.status(404).json({ message: "Visit Record not found!" });
	}
	res.json(visit);
});

//@desc UPDATES A VISIT RECORD
//@route PUT /api/doctor/visit/:id
//@access private (doctor only)
const updateVisit = asyncHandler(async (req, res) => {
	const doctorId = req.user.id;
	const visitId = req.params.id;
	const updates = req.body;

	const visit = await Visit.findOne({
		_id: visitId,
		doctor: doctorId,
	});

	if (!visit) {
		return res
			.status(404)
			.json({ message: "Visit not found or unauthorized!" });
	}

	const session = await Visit.startSession(sessionOptions);
	try {
		session.startTransaction();
		const updatedVisit = await Visit.findByIdAndUpdate(visitId, updates, {
			new: true,
			runValidators: true,
			session,
		});

		await AuditLog.create(
			[
				{
					userId: doctorId,
					operation: "update",
					entity: "Visit",
					entityId: visitId,
					oldValues: visit,
					newValues: updatedVisit,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Visit record updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedVisit,
			message: `Visit with id ${visitId} is successfully updated!`,
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

//@desc DELETE VISIT RECORD
//@route DELETE /api/doctor/visit/:id
//@access private (doctor only)
const deleteVisit = asyncHandler(async (req, res) => {
	const visitId = req.params.id;
	const doctorId = req.user.id;

	const session = await Visit.startSession(sessionOptions);
	try {
		session.startTransaction();

		const visit = await Visit.findOneAndDelete(
			{ _id: visitId, doctor: doctorId },
			{ session }
		);

		if (!visit) {
			return res.status(404).json({ message: "Visit Record not found!" });
		}

		await AuditLog.create(
			[
				{
					userId: doctorId,
					operation: "delete",
					entity: "Visit",
					entityId: visitId,
					oldValues: visit,
					newValues: null,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Visit Record deleted",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res
			.status(201)
			.json({ id: visitId, message: "Visit Record deleted successfully" });
	} catch (error) {
		await session.abortTransaction();
		throw error;
	}
	session.endSession();
});

/**
##### ORDER (CRUD) #####
**/

//@desc ADDS A NEW ORDER
//@route POST /api/doctor/order/:id
//@access private (doctor only)
const createOrder = asyncHandler(async (req, res) => {
	const doctorId = req.user.id;
	const patientId = req.params.id;
	console.log(req.body);
	const {
		frame,
		lens,
		framePrice,
		frameQuantity,
		lensPrice,
		lensQuantity,
		otherItems,
		amount,
	} = req.body;

	if (
		!frame ||
		!lens ||
		!framePrice ||
		!frameQuantity ||
		!lensPrice ||
		!lensQuantity ||
		!amount
	) {
		return res
			.status(404)
			.json({ message: "Please fill in all the required fields!" });
	}

	const existingPatient = await User.findById(patientId);

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
					patient: patientId,
					orderTime: new Date(),
					status: "Pending",
					frame,
					lens,
					framePrice,
					frameQuantity,
					lensQuantity,
					lensPrice,
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
			message: `Patient ${existingPatient.personalInfo.fname} ${existingPatient.personalInfo.lname}'s order is successfully created!`,
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
	const doctorId = new ObjectId(req.user.id);
	const orders = await Order.aggregate([
		{
			$match: {
				doctor: doctorId,
			},
		},
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
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
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
//@route GET /api/doctor/order/:id
//@access private (doctor only)
const getOrderDetails = asyncHandler(async (req, res) => {
	const orderId = new ObjectId(req.params.id);
	const doctorId = new ObjectId(req.user.id);

	const order = await Order.aggregate([
		{
			$match: {
				doctor: doctorId,
				_id: orderId,
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

//@desc UPDATES AN ORDER
//@route PUT /api/doctor/order/:id
//@access private (doctor only)
const updateOrder = asyncHandler(async (req, res) => {
	const doctorId = req.user.id;
	const orderId = req.params.id;
	const updates = req.body;

	console.log(updates);

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
		const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
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
//@route POST /api/doctor/records/:id
//@access private (doctor only)
const addRecord = asyncHandler(async (req, res) => {
	const patientId = req.params.id;
	const {
		"rightEye.sphere": rightEyeSphere,
		"rightEye.cylinder": rightEyeCylinder,
		"rightEye.axis": rightEyeAxis,
		"leftEye.sphere": leftEyeSphere,
		"leftEye.cylinder": leftEyeCylinder,
		"leftEye.axis": leftEyeAxis,
		additionalNotes,
	} = req.body;

	console.log(req.body);

	if (
		rightEyeSphere == "0.00" ||
		rightEyeCylinder == "0.00" ||
		rightEyeAxis == "0" ||
		leftEyeSphere == "0.00" ||
		leftEyeCylinder == "0.00" ||
		leftEyeAxis == "0"
	) {
		return res
			.status(404)
			.json({ message: "Please fill in all the required fields!" });
	}

	const patient = await User.findById(patientId);

	if (!patient) {
		return res.status(404).json({ message: "Patient not found!" });
	}

	const session = await EyeRecord.startSession(sessionOptions);
	try {
		session.startTransaction();

		const rightEye = {
			sphere: rightEyeSphere,
			cylinder: rightEyeCylinder,
			axis: rightEyeAxis,
		};
		const leftEye = {
			sphere: leftEyeSphere,
			cylinder: leftEyeCylinder,
			axis: leftEyeAxis,
		};

		const eyeRecord = await EyeRecord.create(
			[
				{
					doctor: req.user.id,
					patient: patientId,
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
	const doctorId = new ObjectId(req.user.id);
	const records = await EyeRecord.aggregate([
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
				doctor: doctorId,
			},
		},
		{
			$project: {
				createdAt: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				rightEye: 1,
				leftEye: 1,
			},
		},
	]);
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
//@route POST /api/doctor/appointments/:id
//@access private (doctor only)
const createAppointment = async (req, res) => {
	const patientId = req.params.id;
	const doctorId = req.user.id;
	const { date, startTime, endTime, notes } = req.body;

	if (!date || !startTime || !endTime) {
		return res
			.status(404)
			.json({ message: "Please fill in all the required fields!" });
	}

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
			message: `Appointment with ${patient.personalInfo.fname} ${patient.personalInfo.lname} at ${date} successfully added!`,
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
	const doctorId = new ObjectId(req.user.id);
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
				doctor: doctorId,
			},
		},
		{
			$project: {
				date: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				startTime: 1,
				endTime: 1,
				notes: 1,
				status: 1,
			},
		},
	]);
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
	const {
		dayOfWeek,
		startTime,
		endTime,
		lunchBreakStart,
		lunchBreakEnd,
		isLeave,
		isEmergencyBreak,
	} = req.body;

	const doctorId = req.user.id;

	if (
		!dayOfWeek ||
		!startTime ||
		!endTime ||
		!lunchBreakStart ||
		!lunchBreakEnd
	) {
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const schedule = await Schedule.findOne({
		doctor: doctorId,
		dayOfWeek,
	});
	if (schedule) {
		return res.status(400).json({ message: "Schedule already exists!" });
	}

	const isLeaveBool = isLeave === "No" ? false : true;
	const isEmergencyBreakBool = isEmergencyBreak === "No" ? false : true;

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
					lunchBreakStart,
					lunchBreakEnd,
					isLeave: isLeaveBool,
					isEmergencyBreak: isEmergencyBreakBool,
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

		res.status(201).json({
			data: doctorSchedule,
			message: `Schedule for ${dayOfWeek} successfully added!.`,
		});
		await session.commitTransaction();
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

	// Check if the updatedFields contain dayOfWeek
	if (updatedFields.dayOfWeek !== undefined) {
		// Check for conflicting schedules
		const conflictingSchedule = await Schedule.findOne({
			_id: { $ne: scheduleId },
			doctor: doctorId,
			dayOfWeek: updatedFields.dayOfWeek,
		});

		if (conflictingSchedule) {
			return res.status(400).json({
				message: "Schedule conflicts with existing schedule!",
			});
		}
	}

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

		res.json({
			data: updatedSchedule,
			message: `Schedule for ${schedule.dayOfWeek} successfully updated!`,
		});
		await session.commitTransaction();
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

const getInventoryList = asyncHandler(async (req, res) => {
	const inventoryList = await Inventory.find();
	if (inventoryList == {}) {
		res.json({ message: "No items currently in inventory." });
	}
	res.json(inventoryList);
});

module.exports = {
	createPatient,
	getAllPatients,
	getPatientDetails,

	createVisit,
	getVisitList,
	getVisitDetails,
	updateVisit,
	deleteVisit,

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

	getInventoryList,
};
