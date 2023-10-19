const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const fs = require("fs");

const AuditLog = require("../models/auditLogModel");

const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const Order = require("../models/orderModel");
const Maintenance = require("../models/maintenanceModel");
const Appointment = require("../models/appointmentModel");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const sessionOptions = {
	readConcern: { level: "snapshot" },
	writeConcern: { w: "majority" },
};

// Function to calculate the completion rate
function calculateCompletionRate(completedOrders, totalOrders) {
	if (totalOrders === 0) return 0;
	return (completedOrders / totalOrders) * 100;
}

// Function to calculate average processing time
function calculateAverageCompletionTime(orders) {
	if (orders.length === 0) {
		return 0; // Return 0 if there are no completed orders to calculate an average.
	}

	let totalCompletionTime = 0;
	for (const order of orders) {
		const completionTime = order.completeTime - order.acceptTime;
		totalCompletionTime += completionTime;
	}

	// Calculate the average completion time in milliseconds
	const averageCompletionTime = totalCompletionTime / orders.length;

	// Convert the average completion time to hours and minutes
	const hours = Math.floor(averageCompletionTime / (1000 * 60 * 60));
	const minutes = Math.floor(
		(averageCompletionTime % (1000 * 60 * 60)) / (1000 * 60)
	);
	return `${hours}h. ${minutes}m.`;
}

// Function to calculate revenue generated
function calculateTotalRevenue(orders) {
	let totalRevenue = 0;
	for (const order of orders) {
		totalRevenue += order.amount;
	}
	return totalRevenue;
}

/**
##### STAFF MANAGEMENT (CRUD) #####
**/

//@desc REGISTER NEW STAFF ACCOUNT
//@route POST /api/admin/staff
//@access private (admin only)
const registerStaff = asyncHandler(async (req, res) => {
	const {
		fname,
		lname,
		gender,
		email,
		contact,
		address,
		city,
		province,
		password,
		role,
	} = req.body;

	if (
		!fname ||
		!lname ||
		!gender ||
		!email ||
		!contact ||
		!address ||
		!city ||
		!province ||
		!password ||
		!role
	) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const user = await User.findOne({ email });
	if (user) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(400).json({ message: "User already exists!" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const personalInfo = {
		fname,
		lname,
		gender,
		contact,
		address,
		city,
		province,
	};

	const session = await User.startSession(sessionOptions);
	try {
		session.startTransaction();
		let image;
		if (req.file) {
			image = req.file.filename;
		} else {
			image = null;
		}
		const staff = await User.create(
			[
				{
					email,
					password: hashedPassword,
					role,
					isPersonalInfoComplete: true,
					personalInfo,
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
					entity: "User",
					entityId: staff[0]._id,
					oldValues: null,
					newValues: staff[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New staff account added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		const rolestr = role.charAt(0).toUpperCase() + role.slice(1);
		res.status(201).json({
			data: staff,
			message: `${rolestr} ${personalInfo.fname} ${personalInfo.lname}'s account is successfully created!`,
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
		return res.status(400).json({ message: error });
	}
	session.endSession();
});

//@desc GET LIST OF ALL STAFF
//@route GET /api/admin/staff
//@access private (admin only)
const getStaffList = asyncHandler(async (req, res) => {
	const staff = await User.find({
		role: { $in: ["doctor", "technician", "staff"] },
	});
	if (staff.length === 0) {
		res.json({ message: "No staff currently registered." });
	}
	res.json(staff);
});

//@desc GET STAFF ACCOUNT DETAILS
//@route GET /api/admin/staff/:id
//@access Private (admin only)
const getStaffDetails = asyncHandler(async (req, res) => {
	const staffId = req.params.id;
	const staff = await User.findById(staffId);
	if (!staff) {
		return res.status(404).json({ message: "User not found." });
	}
	res.json(staff);
});

//@desc UPDATE EXISTING STAFF ACCOUNT
//@route PUT /api/admin/staff/:id
//@access private (admin only)
const updateStaff = asyncHandler(async (req, res) => {
	const staffId = req.params.id;
	let updates = req.body;

	if (updates.personalInfo && req.file) {
		updates.personalInfo = JSON.parse(updates.personalInfo);
	}

	const staff = await User.findOne({
		_id: staffId,
		role: { $in: ["doctor", "technician", "staff"] },
	});

	if (!staff) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res
			.status(404)
			.json({ message: "Staff account not found or unauthorized!" });
	}

	const session = await User.startSession(sessionOptions);
	try {
		session.startTransaction();
		let image;
		if (req.file) {
			image = req.file.filename;
			updates.image = image;
		} else {
			image = null;
		}

		const updatedStaff = await User.findByIdAndUpdate(staffId, updates, {
			new: true,
			runValidators: true,
			session,
		});

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "update",
					entity: "User",
					entityId: staffId,
					oldValues: staff,
					newValues: updatedStaff,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Staff Account updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		const rolestr = staff.role.charAt(0).toUpperCase() + staff.role.slice(1);
		res.status(201).json({
			data: updatedStaff,
			message: `${rolestr} ${updatedStaff.personalInfo.fname} ${updatedStaff.personalInfo.lname}'s account is successfully updated!`,
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
		return res.status(400).json({ message: error });
	}
	session.endSession();
});

//@desc DELETE STAFF ACCOUNT
//@route DELETE /api/admin/staff/:id
//@access private (admin only)
const deleteUser = asyncHandler(async (req, res) => {
	const userId = req.params.id;

	const session = await User.startSession(sessionOptions);
	try {
		session.startTransaction();

		const staff = await User.findOneAndDelete(
			{
				_id: userId,
				role: { $in: ["doctor", "technician", "staff"] },
			},
			{ session }
		);

		if (!staff) {
			return res
				.status(404)
				.json({ message: "User not found or unauthorized!" });
		}

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "delete",
					entity: "User",
					entityId: userId,
					oldValues: staff,
					newValues: null,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Staff Account deleted",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		const rolestr = staff.role.charAt(0).toUpperCase() + staff.role.slice(1);
		res.status(201).json({
			id: userId,
			message: `${rolestr} ${staff.personalInfo.fname} ${staff.personalInfo.lname}'s account is successfully deleted!`,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		return res.status(400).json({ message: error });
	}
	session.endSession();
});

/**
##### INVENTORY MANAGEMENT (CRUD) #####
**/

//@desc ADD INVENTORY ITEMS
//@route POST /api/admin/inventory
//@access private (admin only)
const addInventoryItem = asyncHandler(async (req, res) => {
	const {
		itemName,
		category,
		unit,
		criticalLevel,
		restockLevel,
		vendor,
		quantity,
		batchNumber,
		expirationDate,
		batchQuantity,
		price,
		description,
		piecesPerBox,
	} = req.body;

	if (
		!itemName ||
		!category ||
		!unit ||
		!criticalLevel ||
		!restockLevel ||
		!vendor ||
		!quantity ||
		!price ||
		!description
	) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const existingItem = await Inventory.findOne({ itemName });

	if (existingItem) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res
			.status(400)
			.json({ message: "Item with the same name already exists!" });
	}

	if (unit === "box" && (!piecesPerBox || piecesPerBox === 0)) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	if (
		category === "Medicine" &&
		(!batchNumber || !expirationDate || !batchQuantity)
	) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const batches = {
		batchNumber,
		expirationDate,
		batchQuantity,
	};

	const session = await Inventory.startSession(sessionOptions);
	try {
		session.startTransaction();
		let image;
		if (req.file) {
			image = req.file.filename;
		} else {
			image = null;
		}
		const inventoryItemData = {
			itemName,
			category,
			unit,
			criticalLevel,
			restockLevel,
			vendor,
			quantity,
			price,
			description,
			image,
		};

		if (category === "Medicine") {
			inventoryItemData.batches = batches;
		}

		if (unit === "box") {
			inventoryItemData.piecesPerBox = piecesPerBox;
		}

		const inventoryItem = await Inventory.create([inventoryItemData], {
			session,
		});

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "create",
					entity: "Inventory",
					entityId: inventoryItem[0]._id,
					oldValues: null,
					newValues: inventoryItem[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New Inventory Item added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			id: inventoryItem,
			message: `Item ${itemName} succesfully added to inventory!`,
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

//@desc GET INVENTORY ITEM LIST
//@route GET /api/admin/inventory
//@access private (admin only)
const getInventoryList = asyncHandler(async (req, res) => {
	const inventoryList = await Inventory.find();
	if (inventoryList.length === 0) {
		res.json({ message: "No items currently in inventory." });
	}
	res.json(inventoryList);
});

//@desc GET INVENTORY ITEM DETAILS
//@route GET /api/admin/inventory/:id
//@access private (admin only)
const getItemDetails = asyncHandler(async (req, res) => {
	const itemId = req.params.id;
	const inventoryItem = await Inventory.findOne({ _id: itemId });
	if (!inventoryItem) {
		return res.status(404).json({ message: "Item not found!" });
	}
	res.json(inventoryItem);
});

//@desc UPDATE INVENTORY ITEM
//@route PUT /api/admin/inventory/:id
//@access private (admin only)
const updateItem = asyncHandler(async (req, res) => {
	const itemId = req.params.id;
	const updatedFields = req.body;

	const item = await Inventory.findOne({ _id: itemId });

	if (!item) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res.status(404).json({ message: "Item not found!" });
	}

	let unsetUpdate = null;

	if (updatedFields.piecesPerBox === "null") {
		if (item.piecesPerBox) {
			unsetUpdate = {
				$unset: {
					["piecesPerBox"]: 1,
				},
			};
		}
		delete updatedFields["piecesPerBox"];
	}

	const session = await Inventory.startSession(sessionOptions);
	try {
		session.startTransaction();
		let image;
		if (req.file) {
			image = req.file.filename;
			updatedFields.image = image;
		} else {
			image = null;
		}

		const updatedItem = await Inventory.findByIdAndUpdate(
			itemId,
			updatedFields,
			{ new: true, runValidators: true, session }
		);

		console.log(unsetUpdate);

		if (unsetUpdate) {
			await Inventory.findByIdAndUpdate(itemId, unsetUpdate, {
				new: true,
				runValidators: true,
				session,
			});
		}

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "update",
					entity: "Inventory",
					entityId: itemId,
					oldValues: item,
					newValues: updatedItem,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Inventory Item updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedItem,
			message: `Item ${item.itemName} succesfully updated!`,
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

//@desc RESTOCK INVENTORY ITEM
//@route PUT /api/admin/restock/:id
//@access private (admin only)
const restockItem = asyncHandler(async (req, res) => {
	const itemId = req.params.id;
	const updatedFields = req.body;

	const item = await Inventory.findOne({ _id: itemId });

	if (!item) {
		return res.status(404).json({ message: "Item not found!" });
	}

	const session = await Inventory.startSession(sessionOptions);
	try {
		session.startTransaction();

		let updateOperation;

		if (updatedFields.batches && updatedFields.quantity) {
			const { batches, quantity } = updatedFields;

			updateOperation = {
				$inc: { quantity: quantity },
				$push: { batches: batches },
			};
		} else {
			updateOperation = {
				$inc: { quantity: updatedFields.quantity },
			};
		}

		const updatedItem = await Inventory.findByIdAndUpdate(
			itemId,
			updateOperation,
			{ new: true, runValidators: true, session }
		);

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "update",
					entity: "Inventory",
					entityId: itemId,
					oldValues: item,
					newValues: updatedItem,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Inventory Item updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedItem,
			message: `Item ${item.itemName} succesfully restocked!`,
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

//@desc DELETE INVENTORY ITEM
//@route DELETE /api/admin/inventory/:id
//@access private (admin only)
const deleteItem = asyncHandler(async (req, res) => {
	const itemId = req.params.id;

	const session = await Inventory.startSession(sessionOptions);
	try {
		session.startTransaction();

		const inventoryItem = await Inventory.findOneAndDelete(
			{ _id: itemId },
			{ session }
		);

		if (!inventoryItem) {
			return res.status(404).json({ message: "Item not found!" });
		}

		await AuditLog.create(
			[
				{
					userId: req.user.id,
					operation: "delete",
					entity: "Inventory",
					entityId: itemId,
					oldValues: inventoryItem,
					newValues: null,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Inventory Item deleted",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res
			.status(201)
			.json({ id: itemId, message: "Inventory Item deleted successfully" });
	} catch (error) {
		await session.abortTransaction();
		throw error;
	}
	session.endSession();
});

/**
##### MAINTENANCE MANAGEMENT (READ AND UPDATE) #####
**/

//@desc GET MAINTENANCE REQUEST LIST
//@route GET /api/admin/maintenance
//@access private (admin only)
const getMaintenanceList = asyncHandler(async (req, res) => {
	const maintenanceRequests = await Maintenance.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "technician",
				foreignField: "_id",
				as: "userDetails",
			},
		},
		{
			$match: {
				status: { $in: ["In Progress", "Completed"] },
			},
		},
		{
			$project: {
				title: 1,
				status: 1,
				details: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				image: 1,
				createdAt: 1,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);

	res.json(maintenanceRequests);
});

//@desc GET PENDING REQUEST LIST
//@route GET /api/admin/pending
//@access private (admin only)
const getPendingRequests = asyncHandler(async (req, res) => {
	const maintenanceRequests = await Maintenance.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "technician",
				foreignField: "_id",
				as: "userDetails",
			},
		},
		{
			$match: {
				status: "Pending",
			},
		},
		{
			$project: {
				title: 1,
				status: 1,
				details: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				image: 1,
				createdAt: 1,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);

	res.json(maintenanceRequests);
});

//@desc GET MAINTENANCE REQUEST DETAILS
//@route GET /api/admin/maintenance/:id
//@access private (admin only)
const getMaintenanceRequestDetails = asyncHandler(async (req, res) => {
	const requestId = req.params.id;
	const maintenanceRequest = await Maintenance.findOne({ _id: requestId });
	if (!maintenanceRequest) {
		return res.status(404).json({ message: "Request not found!" });
	}
	res.json(maintenanceRequest);
});

//@desc UPDATE MAINTENANCE REQUEST STATUS
//@route PUT /api/admin/maintenance/:id
//@access private (admin only)
const updateRequestStatus = asyncHandler(async (req, res) => {
	const requestId = req.params.id;
	const status = req.body;

	const request = await Maintenance.findOne({ _id: requestId });

	if (!request) {
		return res.status(404).json({ message: "Item not found!" });
	}

	const session = await Maintenance.startSession(sessionOptions);
	try {
		session.startTransaction();

		const updatedStatus = await Maintenance.findByIdAndUpdate(
			requestId,
			status,
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
					newValues: updatedStatus,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "Maintenance Status updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedStatus,
			message: `Request with id ${requestId} successfully updated!`,
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

/**
##### AUDIT LOGS (READ ONLY) #####
**/

//@desc GET LIST OF AUDIT LOGS
//@route GET /api/admin/log
//@access private (admin only)
const getAuditLogs = asyncHandler(async (req, res) => {
	const auditLogs = await AuditLog.aggregate([
		{
			$lookup: {
				from: "userDetails",
				localField: "userId",
				foreignField: "_id",
				as: "userDetails",
			},
		},
		{
			$project: {
				createdAt: 1,
				userLastName: { $arrayElemAt: ["$userDetails.personalInfo.lname", 0] },
				userFirstName: { $arrayElemAt: ["$userDetails.personalInfo.fname", 0] },
				operation: 1,
				userIpAddress: 1,
				entity: 1,
				entityId: 1,
				additionalInfo: 1,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]);
	res.json(auditLogs);
});

//@desc GET AUDIT LOG DETAILS
//@route GET /api/admin/log/:id
//@access private (admin only)
const getAuditLogDetails = asyncHandler(async (req, res) => {
	const auditLogId = req.params.id;
	const auditLog = await AuditLog.findById(auditLogId);
	if (!auditLog) {
		return res.status(404).json({ message: "Audit log not found!" });
	}
	res.json(auditLog);
});

/**
##### REPORT GENERATION #####
**/

// Generate weekly staff reports
const generateWeeklyStaffReports = asyncHandler(async (req, res) => {
	try {
		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);

		const weeklyOrders = await Order.find({
			orderTime: { $gte: oneWeekAgo, $lte: now },
			status: "Completed", // Filter for completed orders
		});

		// Group orders by doctor and technician
		const weeklyReports = {};

		weeklyOrders.forEach((order) => {
			const doctorId = order.doctor.toString();
			const technicianId = order.technician ? order.technician.toString() : "";

			if (!weeklyReports[doctorId]) {
				weeklyReports[doctorId] = {
					doctor: doctorId,
					totalOrders: 0,
					completedOrders: 0,
					pendingOrders: 0,
					completionRate: 0,
					avgProcessingTime: 0,
					revenueGenerated: 0,
				};
			}

			if (technicianId && !weeklyReports[technicianId]) {
				weeklyReports[technicianId] = {
					technician: technicianId,
					totalOrders: 0,
					completedOrders: 0,
					pendingOrders: 0,
					completionRate: 0,
					avgCompletionTime: 0,
					revenueGenerated: 0,
				};
			}

			weeklyReports[doctorId].totalOrders++;
			weeklyReports[doctorId].completedOrders++;
			weeklyReports[doctorId].avgProcessingTime =
				calculateAverageProcessingTime([order], doctorId);
			weeklyReports[doctorId].revenueGenerated += order.amount;

			if (technicianId) {
				weeklyReports[technicianId].totalOrders++;
				weeklyReports[technicianId].completedOrders++;
				weeklyReports[technicianId].avgCompletionTime =
					calculateAverageProcessingTime([order], technicianId);
				weeklyReports[technicianId].revenueGenerated += order.amount;
			}
		});

		// Calculate completion rate and pending orders for the week
		Object.values(weeklyReports).forEach((report) => {
			report.completionRate = calculateCompletionRate(
				report.completedOrders,
				report.totalOrders
			);
			report.pendingOrders = report.totalOrders - report.completedOrders;
		});
		res.json(weeklyReports);
	} catch (error) {
		console.error("Error generating weekly reports:", error);
		res.status(500).json({ message: "Error generating weekly reports" });
	}
});

// Generate monthly staff reports
const generateMonthlyStaffReports = asyncHandler(async (req, res) => {
	try {
		const now = new Date();
		const oneMonthAgo = new Date(now);
		oneMonthAgo.setMonth(now.getMonth() - 1);

		const monthlyOrders = await Order.find({
			orderTime: { $gte: oneMonthAgo, $lte: now },
			status: "Completed", // Filter for completed orders
		});

		// Group orders by doctor and technician
		const monthlyReports = {};

		monthlyOrders.forEach((order) => {
			const doctorId = order.doctor.toString();
			const technicianId = order.technician ? order.technician.toString() : "";

			if (!monthlyReports[doctorId]) {
				monthlyReports[doctorId] = {
					doctor: doctorId,
					totalOrders: 0,
					completedOrders: 0,
					pendingOrders: 0,
					completionRate: 0,
					avgProcessingTime: 0,
					revenueGenerated: 0,
				};
			}

			if (technicianId && !monthlyReports[technicianId]) {
				monthlyReports[technicianId] = {
					doctor: technicianId,
					totalOrders: 0,
					completedOrders: 0,
					pendingOrders: 0,
					completionRate: 0,
					avgProcessingTime: 0,
					revenueGenerated: 0,
				};
			}

			monthlyReports[doctorId].totalOrders++;
			monthlyReports[doctorId].completedOrders++;
			monthlyReports[doctorId].avgProcessingTime =
				calculateAverageProcessingTime([order]);
			monthlyReports[doctorId].revenueGenerated += order.amount;

			if (technicianId) {
				monthlyReports[technicianId].totalOrders++;
				monthlyReports[technicianId].completedOrders++;
				monthlyReports[technicianId].avgProcessingTime =
					calculateAverageProcessingTime([order]);
				monthlyReports[technicianId].revenueGenerated += order.amount;
			}
		});

		// Calculate completion rate and pending orders for the month
		Object.values(monthlyReports).forEach((report) => {
			report.completionRate = calculateCompletionRate(
				report.completedOrders,
				report.totalOrders
			);
			report.pendingOrders = report.totalOrders - report.completedOrders;
		});

		console.log(monthlyReports);
		res.json(monthlyReports);
	} catch (error) {
		console.error("Error generating monthly reports:", error);
		res.status(500).json({ message: "Error generating monthly reports" });
	}
});

// Generate weekly technician reports
const generateWeeklyTechnicianReport = asyncHandler(async (req, res) => {
	try {
		const now = new Date();
		const oneMonthAgo = new Date(now);
		oneMonthAgo.setMonth(now.getMonth() - 1);
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);

		// Find all users with the role "technician"
		const technicians = await User.find({ role: "technician" });

		const technicianReports = [];

		for (const technician of technicians) {
			// Find completed orders for the technician within the past week
			const weeklyOrders = await Order.find({
				orderTime: { $gte: oneWeekAgo, $lte: now },
				technician: technician._id,
				status: "Completed",
			});

			// Calculate the total order count for the technician
			const technicianId = new ObjectId(technician._id);
			const totalOrders = await Order.aggregate([
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
					$match: {
						technician: technicianId,
						orderTime: { $gte: oneWeekAgo, $lte: now },
					},
				},

				{
					$project: {
						orderTime: 1,
						status: 1,
						amount: 1,
						patientLastName: {
							$arrayElemAt: ["$userDetails.personalInfo.lname", 0],
						},
						patientFirstName: {
							$arrayElemAt: ["$userDetails.personalInfo.fname", 0],
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

			if (
				weeklyOrders.length === 0 &&
				totalOrders.length === 0 &&
				calculateTotalRevenue(weeklyOrders) === 0 &&
				calculateAverageCompletionTime(weeklyOrders) === 0 &&
				calculateCompletionRate(weeklyOrders.length, totalOrders.length) === 0
			) {
				// Skip this technician if all values except the name are 0
				continue;
			}

			// Process the weeklyOrders to generate the technician's report
			const technicianWeeklyReport = {
				technician:
					technician.personalInfo.fname + " " + technician.personalInfo.lname,
				completedOrders: weeklyOrders.length,
				totalOrders: totalOrders.length,
				totalRevenue: calculateTotalRevenue(weeklyOrders),
				avgCompletionTime: calculateAverageCompletionTime(weeklyOrders),
				completionRate: calculateCompletionRate(
					weeklyOrders.length,
					totalOrders.length
				),
				orders: totalOrders,
			};

			technicianReports.push(technicianWeeklyReport);
		}

		res.json(technicianReports);
	} catch (error) {
		console.error("Error generating weekly technician reports:", error);
		res
			.status(500)
			.json({ message: "Error generating weekly technician reports" });
	}
});

// Generate monthly technician reports
const generateMonthlyTechnicianReport = asyncHandler(async (req, res) => {
	try {
		const now = new Date();
		const oneMonthAgo = new Date(now);
		oneMonthAgo.setMonth(now.getMonth() - 1);

		// Find all users with the role "technician"
		const technicians = await User.find({ role: "technician" });

		const technicianReports = [];

		for (const technician of technicians) {
			// Find completed orders for the technician within the past month
			const monthlyOrders = await Order.find({
				orderTime: { $gte: oneMonthAgo, $lte: now },
				technician: technician._id,
				status: "Completed",
			});

			// Calculate the total order count for the technician within the past month
			// Calculate the total order count for the technician
			const technicianId = new ObjectId(technician._id);
			const totalOrders = await Order.aggregate([
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
					$match: {
						technician: technicianId,
						orderTime: { $gte: oneMonthAgo, $lte: now },
					},
				},

				{
					$project: {
						orderTime: 1,
						status: 1,
						amount: 1,
						patientLastName: {
							$arrayElemAt: ["$userDetails.personalInfo.lname", 0],
						},
						patientFirstName: {
							$arrayElemAt: ["$userDetails.personalInfo.fname", 0],
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

			if (
				monthlyOrders.length === 0 &&
				totalOrders.length === 0 &&
				calculateTotalRevenue(monthlyOrders) === 0 &&
				calculateAverageCompletionTime(monthlyOrders) === 0 &&
				calculateCompletionRate(monthlyOrders.length, totalOrders.length) === 0
			) {
				// Skip this technician if all values except the name are 0
				continue;
			}

			// Process the monthlyOrders to generate the technician's report
			const technicianMonthlyReport = {
				technician:
					technician.personalInfo.fname + " " + technician.personalInfo.lname,
				completedOrders: monthlyOrders.length,
				totalOrders: totalOrders.length,
				totalRevenue: calculateTotalRevenue(monthlyOrders),
				avgCompletionTime: calculateAverageCompletionTime(monthlyOrders),
				completionRate: calculateCompletionRate(
					monthlyOrders.length,
					totalOrders.length
				),
				orders: totalOrders,
			};

			technicianReports.push(technicianMonthlyReport);
		}

		res.json(technicianReports);
	} catch (error) {
		console.error("Error generating monthly technician reports:", error);
		res
			.status(500)
			.json({ message: "Error generating monthly technician reports" });
	}
});

// Generate weekly doctor reports
const generateWeeklyDoctorReport = asyncHandler(async (req, res) => {
	try {
		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);

		// Find all users with the role "doctor"
		const doctors = await User.find({ role: "doctor" });

		const doctorReports = [];

		for (const doctor of doctors) {
			// Find completed appointments for the doctor within the past week
			const weeklyAppointments = await Appointment.find({
				appointmentDate: { $gte: oneWeekAgo, $lte: now },
				status: "Completed",
				doctor: doctor._id,
			});

			// Find total appointments for the doctor within the past week
			const doctorId = new ObjectId(doctor._id);
			const totalWeeklyAppointments = await Appointment.aggregate([
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
						appointmentDate: { $gte: oneWeekAgo, $lte: now },
					},
				},
				{
					$project: {
						appointmentDate: 1,
						userLastName: {
							$arrayElemAt: ["$userDetails.personalInfo.lname", 0],
						},
						userFirstName: {
							$arrayElemAt: ["$userDetails.personalInfo.fname", 0],
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

			// Calculate the total appointment count within the past week
			const totalAppointments = await Appointment.find({
				appointmentDate: { $gte: oneWeekAgo, $lte: now },
			});

			// Format the date in your application code
			const formattedAppointments = totalWeeklyAppointments.map(
				(appointment) => ({
					...appointment,
					appointmentDate: formatAppointmentDate(appointment.appointmentDate),
				})
			);

			// Function to format the date
			function formatAppointmentDate(dateStr) {
				const date = new Date(dateStr);
				const options = { year: "numeric", month: "short", day: "2-digit" };
				return date.toLocaleDateString("en-US", options);
			}

			if (
				weeklyAppointments.length === 0 &&
				totalWeeklyAppointments.length === 0 &&
				totalAppointments.length === 0 &&
				formattedAppointments.length === 0
			) {
				continue;
			}

			// Process the weeklyAppointments to generate the doctor's report
			const doctorWeeklyReport = {
				doctor: `Dr. ${
					doctor.personalInfo.fname + " " + doctor.personalInfo.lname
				}`,
				weeklyAppointments: weeklyAppointments.length,
				totalAppointments: totalWeeklyAppointments.length,
				percentageofAppointments:
					(totalWeeklyAppointments.length / totalAppointments.length) * 100,
				appointments: formattedAppointments,
			};

			doctorReports.push(doctorWeeklyReport);
		}

		res.json(doctorReports);
	} catch (error) {
		console.error("Error generating weekly doctor reports:", error);
		res.status(500).json({ message: "Error generating weekly doctor reports" });
	}
});

// Generate monthly doctor reports
const generateMonthlyDoctorReport = asyncHandler(async (req, res) => {
	try {
		const now = new Date();
		const oneMonthAgo = new Date(now);
		oneMonthAgo.setMonth(now.getMonth() - 1);

		// Find all users with the role "doctor"
		const doctors = await User.find({ role: "doctor" });

		const doctorReports = [];

		for (const doctor of doctors) {
			// Find completed appointments for the doctor within the past month
			const monthlyAppointments = await Appointment.find({
				appointmentDate: { $gte: oneMonthAgo, $lte: now },
				status: "Completed",
				doctor: doctor._id,
			});

			// Find total appointments for the doctor within the past month
			const doctorId = new ObjectId(doctor._id);
			const totalMonthlyAppointments = await Appointment.aggregate([
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
						appointmentDate: { $gte: oneMonthAgo, $lte: now },
					},
				},
				{
					$project: {
						appointmentDate: 1,
						userLastName: {
							$arrayElemAt: ["$userDetails.personalInfo.lname", 0],
						},
						userFirstName: {
							$arrayElemAt: ["$userDetails.personalInfo.fname", 0],
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

			// Format the date in your application code
			const formattedAppointments = totalMonthlyAppointments.map(
				(appointment) => ({
					...appointment,
					appointmentDate: formatAppointmentDate(appointment.appointmentDate),
				})
			);

			// Function to format the date
			function formatAppointmentDate(dateStr) {
				const date = new Date(dateStr);
				const options = { year: "numeric", month: "short", day: "2-digit" };
				return date.toLocaleDateString("en-US", options);
			}

			// Calculate the total appointment count within the past month
			const totalAppointments = await Appointment.find({
				appointmentDate: { $gte: oneMonthAgo, $lte: now },
			});

			if (
				monthlyAppointments.length === 0 &&
				totalMonthlyAppointments.length === 0 &&
				totalAppointments.length === 0 &&
				formattedAppointments.length === 0
			) {
				continue;
			}

			// Process the monthlyAppointments to generate the doctor's report
			const doctorMonthlyReport = {
				doctor: `Dr. ${
					doctor.personalInfo.fname + " " + doctor.personalInfo.lname
				}`,
				monthlyAppointments: monthlyAppointments.length,
				totalAppointments: totalMonthlyAppointments.length,
				percentageofAppointments:
					(totalMonthlyAppointments.length / totalAppointments.length) * 100,
				appointments: formattedAppointments,
			};

			doctorReports.push(doctorMonthlyReport);
		}

		res.json(doctorReports);
	} catch (error) {
		console.error("Error generating monthly doctor reports:", error);
		res
			.status(500)
			.json({ message: "Error generating monthly doctor reports" });
	}
});

// Generate inventory report
const generateInventoryReport = asyncHandler(async (req, res) => {
	const inventoryList = await Inventory.find();

	if (inventoryList.length === 0) {
		return res.json({ message: "No items currently in inventory." });
	}

	// Process the data to create the report
	const report = inventoryList.map((item) => {
		const stockStatus =
			item.quantity <= item.criticalLevel
				? "Low Stock"
				: item.quantity <= item.restockLevel
				? "Needs Restocking"
				: "In Stock";

		return {
			itemName: item.itemName,
			category: item.category,
			quantity: item.quantity,
			unit: item.unit,
			price: item.price,
			vendor: item.vendor,
			description: item.description,
			stockStatus,
		};
	});
	console.log(report);
	res.json(report);
});

module.exports = {
	registerStaff,
	getStaffList,
	getStaffDetails,
	updateStaff,
	deleteUser,

	addInventoryItem,
	getInventoryList,
	getItemDetails,
	updateItem,
	restockItem,
	deleteItem,

	getMaintenanceList,
	getPendingRequests,
	getMaintenanceRequestDetails,
	updateRequestStatus,

	getAuditLogs,
	getAuditLogDetails,

	generateWeeklyTechnicianReport,
	generateMonthlyTechnicianReport,
	generateWeeklyDoctorReport,
	generateMonthlyDoctorReport,
	generateInventoryReport,
};
