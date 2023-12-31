const asyncHandler = require("express-async-handler");
const fs = require("fs");
const AuditLog = require("../models/auditLogModel");

const Order = require("../models/orderModel");
const Inventory = require("../models/inventoryModel");
const Maintenance = require("../models/maintenanceModel");
const Repair = require("../models/repairModel");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const sessionOptions = {
	readConcern: { level: "snapshot" },
	writeConcern: { w: "majority" },
};

/**
##### ORDER (READ, UPDATE, AND DELETE) #####
**/

//@desc GET ALL PENDING ORDERS
//@route GET /api/technician/order
//@access private (technician only)
const getPendingOrders = asyncHandler(async (req, res) => {
	const orders = await Order.aggregate([
		{
			$match: {
				status: "Pending",
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
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "doctorDetails",
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

//@desc GET ALL THE TECHNICIAN'S ORDER HISTORY
//@route GET /api/technician/order-history
//@access private (technician only)
const getOrderHistory = asyncHandler(async (req, res) => {
	const technicianId = new ObjectId(req.user.id);
	const orders = await Order.aggregate([
		{
			$match: {
				technician: technicianId,
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
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "doctorDetails",
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
			$project: {
				orderTime: 1,
				acceptTime: 1,
				completeTime: 1,
				status: 1,
				amount: 1,
				doctorLastName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.lname", 0],
				},
				doctorFirstName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.fname", 0],
				},
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
		{
			$sort: {
				orderTime: -1, // Sort in descending order
			},
		},
	]);
	res.json(orders);
});

//@desc GET DETAILS OF ORDER
//@route GET /api/technician/order/:id
//@access private (technician only)
const getOrderDetails = asyncHandler(async (req, res) => {
	const orderId = new ObjectId(req.params.id);

	const order = await Order.aggregate([
		{
			$match: {
				_id: orderId,
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
				from: "userDetails",
				localField: "doctor",
				foreignField: "_id",
				as: "doctorDetails",
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
			$project: {
				orderTime: 1,
				acceptTime: 1,
				completeTime: 1,
				status: 1,
				amount: 1,
				doctorLastName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.lname", 0],
				},
				doctorFirstName: {
					$arrayElemAt: ["$doctorDetails.personalInfo.fname", 0],
				},
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

	if (!order) {
		return res.status(404).json({ message: "Order not found!" });
	}
	if (order) {
		res.json(order[0]);
	}
});

//@desc UPDATES AN ORDER
//@route PUT /api/technician/order/:id
//@access private (technician only)
const updateOrderStatus = asyncHandler(async (req, res) => {
	const orderId = req.params.id;
	const technicianId = req.user.id;
	const updates = req.body;

	const order = await Order.findOne({
		_id: orderId,
	});

	if (!order) {
		return res
			.status(404)
			.json({ message: "Order not found or unauthorized!" });
	}

	const session = await Order.startSession(sessionOptions);
	try {
		session.startTransaction();

		if (updates.status === "In Progress") {
			updates.technician = technicianId;
			updates.acceptTime = new Date();
		}

		if (updates.status === "Completed") {
			updates.completeTime = new Date();
			const items = [];
			const itemMap = {};

			const itemExists = (itemId) => itemMap[itemId];

			if (order.lens) {
				const lensId = order.lens.toString();
				if (!itemExists(lensId)) {
					items.push({ item: lensId, quantity: order.lensQuantity });
					itemMap[lensId] = order.lensQuantity;
				} else {
					itemMap[lensId] += order.lensQuantity;
				}
			}

			if (order.frame) {
				const frameId = order.frame.toString();
				if (!itemExists(frameId)) {
					items.push({ item: frameId, quantity: order.frameQuantity });
					itemMap[frameId] = order.frameQuantity;
				} else {
					itemMap[frameId] += order.frameQuantity;
				}
			}

			if (order.otherItems && order.otherItems.length > 0) {
				for (const otherItem of order.otherItems) {
					const otherItemId = otherItem._id.toString();
					const otherItemQuantity = otherItem.quantity;
					if (!itemExists(otherItemId)) {
						items.push({ item: otherItemId, quantity: otherItemQuantity });
						itemMap[otherItemId] = otherItemQuantity;
					} else {
						itemMap[otherItemId] += otherItemQuantity;
					}
				}
			}

			for (const itemId in itemMap) {
				const oldItem = await Inventory.findOne({ _id: itemId });
				const quantityChange = -itemMap[itemId];
				if (oldItem.quantity < Math.abs(quantityChange)) {
					await session.abortTransaction();
					session.endSession();
					return res
						.status(400)
						.json({ message: "Insufficient stock on hand!" });
				}
				const inventoryItem = await Inventory.findByIdAndUpdate(
					{ _id: itemId },
					{ $inc: { quantity: quantityChange } },
					{ new: true, runValidators: true, session }
				);

				if (inventoryItem.category === "Medicine") {
					const batches = inventoryItem.batches;

					batches.sort((a, b) => a.expirationDate - b.expirationDate);

					let remainingQuantity = Math.abs(quantityChange);

					for (let i = 0; i < batches.length; i++) {
						if (remainingQuantity > 0) {
							const batch = batches[i];
							if (batch.batchQuantity > 0) {
								const subtractQuantity = Math.min(
									remainingQuantity,
									batch.batchQuantity
								);
								batch.batchQuantity -= subtractQuantity;
								remainingQuantity -= subtractQuantity;
							}
						} else {
							break;
						}
					}

					for (const batch of batches) {
						if (batch.batchQuantity < 0) {
							await session.abortTransaction();
							session.endSession();
							return res
								.status(400)
								.json({ message: "Batch quantity cannot go negative" });
						}
					}

					await inventoryItem.save({ session });
				}

				await AuditLog.create(
					[
						{
							userId: req.user.id,
							operation: "update",
							entity: "Inventory",
							entityId: itemId,
							oldValues: oldItem,
							newValues: inventoryItem,
							userIpAddress: req.ip,
							userAgent: req.get("user-agent"),
							additionalInfo: "Inventory updated",
						},
					],
					{ session }
				);
			}
		}

		const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
			new: true,
			runValidators: true,
			session,
		});

		await AuditLog.create(
			[
				{
					userId: req.user.id,
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
		console.log(error);
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
//@route DELETE /api/technician/order/:id
//@access private (technician only)
const deleteOrder = asyncHandler(async (req, res) => {
	const orderId = req.params.id;

	const session = await Order.startSession(sessionOptions);
	try {
		session.startTransaction();

		const order = await Order.findOneAndDelete(
			{
				_id: orderId,
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
					userId: req.user.id,
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
##### INVENTORY (READ ONLY) #####
**/

//@desc GET INVENTORY ITEM LIST
//@route GET /api/technician/inventory
//@access private (technician only)
const getInventoryList = asyncHandler(async (req, res) => {
	const inventoryList = await Inventory.find();
	if (inventoryList == {}) {
		res.json({ message: "No items currently in inventory." });
	}
	res.json(inventoryList);
});

//@desc GET INVENTORY ITEM DETAILS
//@route GET /api/technician/inventory/:id
//@access private (technician only)
const getItemDetails = asyncHandler(async (req, res) => {
	const itemId = req.params.id;
	const inventoryItem = await Inventory.findOne({ _id: itemId });
	if (!inventoryItem) {
		return res.status(404).json({ message: "Item not found!" });
	}
	res.json(inventoryItem);
});

/**
##### MAINTENANCE (CRUD) #####
**/

//@desc CREATE MAINTENANCE REQUEST
//@route POST /api/technician/maintenance
//@access private (technician only)

const createMaintenanceRequest = asyncHandler(async (req, res) => {
	const technicianId = req.user.id;
	const { title, details } = req.body;

	if (!title || !details) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const session = await Maintenance.startSession(sessionOptions);
	try {
		session.startTransaction();
		let image;
		if (req.file) {
			image = req.file.filename;
		} else {
			image = null;
		}

		const maintenanceRequest = await Maintenance.create(
			[
				{
					title,
					status: "Pending",
					details,
					technician: technicianId,
					image,
				},
			],
			{ session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "create",
					entity: "Maintenance",
					entityId: maintenanceRequest[0]._id,
					oldValues: null,
					newValues: maintenanceRequest[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New Maintenance Request added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: maintenanceRequest,
			message: `Request ${title} succesfully created!`,
		});
	} catch (error) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
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

//@desc GET MAINTENANCE REQUEST LIST
//@route GET /api/technician/maintenance
//@access private (technician only)
const getMaintenanceList = asyncHandler(async (req, res) => {
	const technicianId = req.user.id;
	const maintenanceRequests = await Maintenance.find({
		technician: technicianId,
	});
	res.json(maintenanceRequests);
});

//@desc GET MAINTENANCE REQUEST DETAILS
//@route GET /api/technician/maintenance/:id
//@access private (technician only)
const getMaintenanceRequestDetails = asyncHandler(async (req, res) => {
	const requestId = req.params.id;
	const maintenanceRequest = await Maintenance.findOne({
		_id: requestId,
	});
	res.json(maintenanceRequest);
});

//@desc UPDATE MAINTENANCE REQUEST STATUS
//@route PUT /api/technician/maintenance/:id
//@access private (technician only)
const updateMaintenanceRequest = asyncHandler(async (req, res) => {
	const requestId = req.params.id;
	const updates = req.body;

	const request = await Maintenance.findOne({
		_id: requestId,
	});

	if (!request) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(404).json({ message: "Request not found!" });
	}

	const session = await Maintenance.startSession(sessionOptions);
	try {
		session.startTransaction();
		let image;
		if (req.file) {
			image = req.file.filename;
			updates.image = image;
		} else {
			image = null;
		}

		const updatedRequest = await Maintenance.findByIdAndUpdate(
			requestId,
			updates,
			{ new: true, runValidators: true, session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "update",
					entity: "Maintenance",
					entityId: requestId,
					oldValues: request,
					newValues: updatedRequest,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Maintenance Status updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedRequest,
			message: `Request with id ${requestId} successfully updated!`,
		});
	} catch (error) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
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

//@desc DELETE MAINTENANCE REQUEST
//@route DELETE /api/technician/maintenance/:id
//@access private (technician only)
const deleteRequest = asyncHandler(async (req, res) => {
	const requestId = req.params.id;

	const session = await Maintenance.startSession(sessionOptions);
	try {
		session.startTransaction();

		const maintenanceRequest = await Maintenance.findOneAndDelete(
			{
				_id: requestId,
			},
			{ session }
		);

		if (!maintenanceRequest) {
			return res
				.status(404)
				.json({ message: "Request not found or unauthorized!" });
		}

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "delete",
					entity: "Maintenance",
					entityId: maintenanceRequest._id,
					oldValues: maintenanceRequest,
					newValues: null,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Maintenance Request deleted",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			id: requestId,
			message: `Maintenance request is successfully deleted!`,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		return res.status(400).json({ message: error });
	}
	session.endSession();
});

/**
##### REPAIR (READ AND UPDATE) #####
**/

//@desc GET LIST OF TECHNICIAN'S PREVIOUS REPAIRS
//@route GET /api/technician/repair
//@access private (technician only)
const getRepairHistory = asyncHandler(async (req, res) => {
	const technicianId = new ObjectId(req.user.id);
	const repairList = await Repair.aggregate([
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
			$match: { technician: technicianId },
		},
		{
			$project: {
				createdAt: 1,
				doctor: 1,
				technician: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				docLastName: { $arrayElemAt: ["$docDetails.personalInfo.lname", 0] },
				docFirstName: { $arrayElemAt: ["$docDetails.personalInfo.fname", 0] },
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

//@desc GET LIST OF PENDING REPAIR REQUEST
//@route GET /api/technician/pending/repair
//@access private (technician only)
const getPendingRepairs = asyncHandler(async (req, res) => {
	const request = await Repair.aggregate([
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
				status: "Pending",
			},
		},
		{
			$project: {
				createdAt: 1,
				doctor: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				docLastName: { $arrayElemAt: ["$docDetails.personalInfo.lname", 0] },
				docFirstName: { $arrayElemAt: ["$docDetails.personalInfo.fname", 0] },
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
	res.json(request);
});

//@desc GET REPAIR REQUEST DETAILS
//@route GET /api/technician/repair/:id
//@access private (technician only)
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

//@desc UPDATE DOCTOR'S SCHEDULE
//@route PUT /api/technician/repair/:id
//@access private (technician only)
const updateRepairRequest = asyncHandler(async (req, res) => {
	const technicianId = req.user.id;
	const requestId = req.params.id;
	const updates = req.body;

	const request = await Repair.findOne({
		_id: requestId,
	});

	if (!request) {
		return res
			.status(404)
			.json({ message: "Repair request not found or unauthorized!" });
	}

	const session = await Repair.startSession(sessionOptions);
	try {
		session.startTransaction();

		if (updates.status === "In Progress") {
			updates.technician = technicianId;
			updates.acceptTime = new Date();
		}

		if (updates.status === "Completed") {
			updates.completeTime = new Date();
		}

		const updatedRequest = await Repair.findByIdAndUpdate(requestId, updates, {
			new: true,
			runValidators: true,
			session,
		});

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "update",
					entity: "Repair",
					entityId: requestId,
					oldValues: request,
					newValues: updatedRequest,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Repair request updated",
				},
			],
			{ session }
		);

		res.json({
			data: updatedRequest,
			message: `Repair request for ${request.itemType} successfully updated!`,
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

module.exports = {
	getPendingOrders,
	getOrderHistory,
	getOrderDetails,
	updateOrderStatus,
	deleteOrder,

	getInventoryList,
	getItemDetails,

	createMaintenanceRequest,
	getMaintenanceList,
	getMaintenanceRequestDetails,
	updateMaintenanceRequest,
	deleteRequest,

	getRepairHistory,
	getPendingRepairs,
	getRepairDetails,
	updateRepairRequest,
};
