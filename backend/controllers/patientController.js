const asyncHandler = require("express-async-handler");
const EyeRecord = require("../models/eyeRecordsModel");
const Order = require("../models/orderModel");

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

//@desc GET ALL THE ORDERS MADE BY THE DOCTOR
//@route GET /api/patient/order
//@access private (patient only)
const getAllOrders = asyncHandler(async (req, res) => {
	const patientId = req.user.id;
	const orders = await Order.find({ _id: patientId });
	if (orders == {}) {
		res.json({ message: "No orders currently saved in the system." });
	}
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

module.exports = {
	getRecords,
	getRecordDetails,

	getAllOrders,
	getOrderDetails,
};
