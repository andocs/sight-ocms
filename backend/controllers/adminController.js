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

const calculateSalesVelocity = async (item, category, startDate) => {
	const now = new Date();

	try {
		const itemField =
			category === "Frame"
				? "frame"
				: category === "Lens"
				? "lens"
				: "otherItems._id"; // Use the path to the _id field in otherItems

		const query = {
			completeTime: { $gte: startDate, $lte: now },
		};

		if (itemField === "otherItems._id") {
			query["otherItems._id"] = item._id;
		} else {
			query[itemField] = item._id;
		}

		const relevantOrders = await Order.find(query);

		// Calculate the number of orders and the number of days in the period
		const numOrders = relevantOrders.length;
		const timeDifferenceInMs = now - startDate;
		const numDays = timeDifferenceInMs / (1000 * 60 * 60 * 24);

		// Calculate the sales velocity (average orders per day)
		const salesVelocity = numOrders / numDays;

		return salesVelocity;
	} catch (error) {
		console.error("Error calculating sales velocity:", error);
		return 0; // Return 0 in case of an error or no orders
	}
};

// Function to calculate average processing time
function calculateAverageCompletionTime(orders) {
	if (orders.length === 0) {
		return 0;
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

function formatPrice(price) {
	// Check if the price is a valid number
	if (typeof price !== "number" || isNaN(price)) {
		return price; // Return as is if not a valid number
	}

	// Check if the price has decimal places
	const formattedPrice = price.toLocaleString("en-US", {
		style: "currency",
		currency: "PHP",
		minimumFractionDigits: 0, // Minimum fraction digits to display
		maximumFractionDigits: 2, // Maximum fraction digits to display
	});

	return formattedPrice;
}

function formatDate(dateStr) {
	const date = new Date(dateStr);

	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const period = hours >= 12 ? "PM" : "AM";

	// Adjust hours to 12-hour format
	const formattedHours = hours % 12 || 12;

	// Ensure that single-digit minutes have a leading zero
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

	const formattedDate = `${monthNames[monthIndex]} ${day}, ${year} at ${formattedHours}:${formattedMinutes} ${period}`;

	return formattedDate;
}

function formatOrderDate(dateStr) {
	const date = new Date(dateStr);
	const options = { year: "numeric", month: "short", day: "2-digit" };
	return date.toLocaleDateString("en-US", options);
}

// Create a function to find the number of sales of a specific item within a category
const findItemSales = async (itemId, category, startDate) => {
	const now = new Date();

	let sales;
	let itemsSold = 0;

	switch (category) {
		case "Frame":
			sales = await Order.find({
				orderTime: { $gte: startDate, $lte: now },
				status: "Completed",
				frame: itemId,
			});
			break;
		case "Lens":
			sales = await Order.find({
				orderTime: { $gte: startDate, $lte: now },
				status: "Completed",
				lens: itemId,
			});
			break;
		default:
			sales = await Order.find({
				orderTime: { $gte: startDate, $lte: now },
				status: "Completed",
				"otherItems._id": itemId,
			});
			break;
	}

	// Use Promise.all to await all queries and process the results
	await Promise.all(
		sales.map((sale) => {
			if (category === "Frame") {
				itemsSold += sale.frameQuantity;
			} else if (category === "Lens") {
				itemsSold += sale.lensQuantity;
			} else {
				const otherItem = sale.otherItems.find(
					(oi) => oi._id.toString() === itemId.toString()
				);

				if (otherItem) {
					itemsSold += otherItem.quantity;
				}
			}
		})
	);

	return itemsSold;
};

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
		res.json(inventoryList);
	} else {
		const formattedInventoryList = inventoryList.map((item) => ({
			...item._doc,
			price: formatPrice(item.price),
		}));
		res.json(formattedInventoryList);
	}
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
##### REPORT GENERATION (STAFF) #####
**/

// Generate weekly technician reports
const generateWeeklyTechnicianReport = asyncHandler(async (req, res) => {
	try {
		const now = new Date();
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
						lensName: { $arrayElemAt: ["$lensDetails.itemName", 0] },
						lensQuantity: 1,
						frameName: { $arrayElemAt: ["$frameDetails.itemName", 0] },
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

			// Format the date in your application code
			const formattedOrders = totalOrders.map((order) => ({
				...order,
				amount: formatPrice(order.amount),
				orderTime: formatDate(order.orderTime),
			}));

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
				orders: formattedOrders,
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

			// Format the date in your application code
			const formattedOrders = totalOrders.map((order) => ({
				...order,
				amount: formatPrice(order.amount),
				orderTime: formatDate(order.orderTime),
			}));

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
				orders: formattedOrders,
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
			formattedAppointments.length === 0
		) {
			continue;
		}
		const percentageValue =
			(totalWeeklyAppointments.length / totalAppointments.length) * 100;

		const formattedPercentage =
			percentageValue % 1 === 0 ? percentageValue : percentageValue.toFixed(2);
		// Process the weeklyAppointments to generate the doctor's report
		const doctorWeeklyReport = {
			doctor: `Dr. ${
				doctor.personalInfo.fname + " " + doctor.personalInfo.lname
			}`,
			periodAppointments: weeklyAppointments.length,
			totalAppointments: totalWeeklyAppointments.length,
			percentageofAppointments: formattedPercentage,
			appointments: formattedAppointments,
		};

		doctorReports.push(doctorWeeklyReport);
	}

	res.json(doctorReports);
});

// Generate monthly doctor reports
const generateMonthlyDoctorReport = asyncHandler(async (req, res) => {
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
			formattedAppointments.length === 0
		) {
			continue;
		}

		const percentageValue =
			(totalMonthlyAppointments.length / totalAppointments.length) * 100;

		const formattedPercentage =
			percentageValue % 1 === 0 ? percentageValue : percentageValue.toFixed(2);

		// Process the monthlyAppointments to generate the doctor's report
		const doctorMonthlyReport = {
			doctor: `Dr. ${
				doctor.personalInfo.fname + " " + doctor.personalInfo.lname
			}`,
			periodAppointments: monthlyAppointments.length,
			totalAppointments: totalMonthlyAppointments.length,
			percentageofAppointments: formattedPercentage,
			appointments: formattedAppointments,
		};

		doctorReports.push(doctorMonthlyReport);
	}

	res.json(doctorReports);
});

/**
##### REPORT GENERATION (INVENTORY) #####
**/

// Generate inventory report
const generateInventoryReport = asyncHandler(async (req, res) => {
	const inventoryList = await Inventory.find();

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
			vendor: item.vendor,
			category: item.category,
			quantity: item.quantity,
			value: formatPrice(item.price * item.quantity),
			price: formatPrice(item.price),
			stockStatus,
		};
	});
	res.json(report);
});

// Generate weekly order history report
const generateWeeklyOrderReport = asyncHandler(async (req, res) => {
	const now = new Date();
	const oneWeekAgo = new Date(now);
	oneWeekAgo.setDate(now.getDate() - 7);

	const orders = await Order.aggregate([
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
			$match: {
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
				lensName: { $arrayElemAt: ["$lensDetails.itemName", 0] },
				lensQuantity: 1,
				frameName: { $arrayElemAt: ["$frameDetails.itemName", 0] },
				frameQuantity: 1,
				otherItems: 1,
			},
		},
		{
			$sort: {
				orderTime: 1,
			},
		},
	]);

	// Format the date in your application code
	const formattedOrders = orders.map((order) => ({
		...order,
		amount: formatPrice(order.amount),
		orderTime: formatOrderDate(order.orderTime),
	}));

	// Function to format the date
	function formatOrderDate(dateStr) {
		const date = new Date(dateStr);
		const options = { year: "numeric", month: "short", day: "2-digit" };
		return date.toLocaleDateString("en-US", options);
	}

	res.json(formattedOrders);
});

// Generate monthly order history report
const generateMonthlyOrderReport = asyncHandler(async (req, res) => {
	const now = new Date();
	const oneMonthAgo = new Date(now);
	oneMonthAgo.setMonth(now.getMonth() - 1);

	const orders = await Order.aggregate([
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
			$match: {
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
				lensName: { $arrayElemAt: ["$lensDetails.itemName", 0] },
				lensQuantity: 1,
				frameName: { $arrayElemAt: ["$frameDetails.itemName", 0] },
				frameQuantity: 1,
				otherItems: 1,
			},
		},
		{
			$sort: {
				orderTime: 1,
			},
		},
	]);

	// Format the date in your application code
	const formattedOrders = orders.map((order) => ({
		...order,
		amount: formatPrice(order.amount),
		orderTime: formatOrderDate(order.orderTime),
	}));

	res.json(formattedOrders);
});

// Generate medicine expiration report
const generateBatchesExpirationReport = asyncHandler(async (req, res) => {
	const inventoryList = await Inventory.find({
		category: "Medicine",
	});

	// Process the data to create the report
	const report = [];

	inventoryList.forEach((item) => {
		item.batches.forEach((batch) => {
			if (batch.batchQuantity > 0) {
				// Filter out 0 quantity batches
				report.push({
					itemName: item.itemName,
					vendor: item.vendor,
					value: formatPrice(item.price * batch.batchQuantity),
					batchNumber: batch.batchNumber,
					expirationDate: formatExpDate(batch.expirationDate),
					batchQuantity: batch.batchQuantity,
				});
			}
		});
	});

	// Function to format the date
	function formatExpDate(dateStr) {
		const date = new Date(dateStr);
		const options = { year: "numeric", month: "short", day: "2-digit" };
		return date.toLocaleDateString("en-US", options);
	}
	console.log(report);
	res.json(report);
});

// Generate monthly sales velocity report
const generateMonthlySalesVelocityReport = asyncHandler(async (req, res) => {
	const now = new Date();
	const oneMonthAgo = new Date(now);
	oneMonthAgo.setDate(now.getMonth() - 1);
	// Fetch all items in the inventory
	const inventoryList = await Inventory.find();

	// Process the data to create the report
	const report = await Promise.all(
		inventoryList.map(async (item) => {
			const category = item.category;
			const salesVelocity = await calculateSalesVelocity(
				item,
				category,
				oneMonthAgo
			);
			const projectFields = {
				orderTime: 1,
				status: 1,
				amount: 1,
				patientLastName: {
					$arrayElemAt: ["$userDetails.personalInfo.lname", 0],
				},
				patientFirstName: {
					$arrayElemAt: ["$userDetails.personalInfo.fname", 0],
				},
				orders: 1,
			};

			if (category === "Lens") {
				projectFields.itemName = {
					$arrayElemAt: ["$lensDetails.itemName", 0],
				};
				projectFields.itemQuantity = "$lensQuantity";
			} else if (category === "Frame") {
				projectFields.itemName = {
					$arrayElemAt: ["$frameDetails.itemName", 0],
				};
				projectFields.itemQuantity = "$frameQuantity";
			} else if (category === "Medicine" || category === "Others") {
				projectFields.itemName = {
					$arrayElemAt: ["$itemDetails.itemName", 0],
				};
				projectFields.itemQuantity = {
					$arrayElemAt: ["$otherItems.quantity", 0],
				};
			}

			const orders = await Order.aggregate([
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
						localField: "otherItems._id",
						foreignField: "_id",
						as: "itemDetails",
					},
				},
				{
					$match: {
						$or: [
							{ frame: item._id },
							{ lens: item._id },
							{ "otherItems._id": item._id },
						],
						orderTime: { $gte: oneMonthAgo, $lte: now },
						status: "Completed",
					},
				},

				{
					$project: projectFields,
				},
				{
					$sort: {
						orderTime: 1,
					},
				},
			]);

			// Format the date in your application code
			const formattedOrders = orders.map((order) => ({
				...order,
				amount: formatPrice(order.amount),
				orderTime: formatOrderDate(order.orderTime),
			}));

			return {
				itemName: item.itemName,
				itemsSold: await findItemSales(item._id, category, oneMonthAgo),
				quantity: item.quantity,
				salesVelocity: salesVelocity.toFixed(2),
				totalOrders: formattedOrders.length,
				orders: formattedOrders,
			};
		})
	);

	// Filter the items with itemsSold greater than 0
	const filteredReport = report.filter((item) => item.itemsSold > 0);

	// Calculate the thresholds for fast-moving and slow-moving items based on filtered items
	const totalItems = filteredReport.length;
	const fastMovingThreshold = Math.floor(0.2 * totalItems); // Consider top 20% as fast-moving
	const slowMovingThreshold = Math.floor(0.2 * totalItems); // Consider bottom 20% as slow-moving

	// Sort the report based on sales velocity
	filteredReport.sort((a, b) => b.salesVelocity - a.salesVelocity);

	// Categorize the items
	const categorizedItems = filteredReport.map((item, index) => {
		if (item.salesVelocity > 0) {
			if (index < fastMovingThreshold) {
				item.movementCategory = "Fast-Moving";
			} else if (index >= totalItems - slowMovingThreshold) {
				item.movementCategory = "Slow-Moving";
			} else {
				item.movementCategory = "Medium-Moving";
			}
			return item;
		} else {
			item.movementCategory = "Zero-Moving";
			return item;
		}
	});

	res.json(categorizedItems);
});

// Generate weekly sales velocity report
const generateQuarterlySalesVelocityReport = asyncHandler(async (req, res) => {
	const now = new Date();
	const oneQuarterAgo = new Date(now);
	oneQuarterAgo.setDate(now.getDate() - 91);
	// Fetch all items in the inventory
	const inventoryList = await Inventory.find();

	// Process the data to create the report
	const report = await Promise.all(
		inventoryList.map(async (item) => {
			const category = item.category;
			const salesVelocity = await calculateSalesVelocity(
				item,
				category,
				oneQuarterAgo
			);
			const projectFields = {
				orderTime: 1,
				status: 1,
				amount: 1,
				patientLastName: {
					$arrayElemAt: ["$userDetails.personalInfo.lname", 0],
				},
				patientFirstName: {
					$arrayElemAt: ["$userDetails.personalInfo.fname", 0],
				},
				orders: 1,
			};

			if (category === "Lens") {
				projectFields.itemName = {
					$arrayElemAt: ["$lensDetails.itemName", 0],
				};
				projectFields.itemQuantity = "$lensQuantity";
			} else if (category === "Frame") {
				projectFields.itemName = {
					$arrayElemAt: ["$frameDetails.itemName", 0],
				};
				projectFields.itemQuantity = "$frameQuantity";
			} else if (category === "Medicine" || category === "Others") {
				projectFields.itemName = {
					$arrayElemAt: ["$itemDetails.itemName", 0],
				};
				projectFields.itemQuantity = {
					$arrayElemAt: ["$otherItems.quantity", 0],
				};
			}

			const orders = await Order.aggregate([
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
						localField: "otherItems._id",
						foreignField: "_id",
						as: "itemDetails",
					},
				},
				{
					$match: {
						$or: [
							{ frame: item._id },
							{ lens: item._id },
							{ "otherItems._id": item._id },
						],
						orderTime: { $gte: oneQuarterAgo, $lte: now },
						status: "Completed",
					},
				},

				{
					$project: projectFields,
				},
				{
					$sort: {
						orderTime: 1,
					},
				},
			]);

			// Format the date in your application code
			const formattedOrders = orders.map((order) => ({
				...order,
				amount: formatPrice(order.amount),
				orderTime: formatOrderDate(order.orderTime),
			}));

			return {
				itemName: item.itemName,
				itemsSold: await findItemSales(item._id, category, oneQuarterAgo),
				quantity: item.quantity,
				salesVelocity: salesVelocity.toFixed(2),
				totalOrders: formattedOrders.length,
				orders: formattedOrders,
			};
		})
	);

	// Filter the items with itemsSold greater than 0
	const filteredReport = report.filter((item) => item.itemsSold > 0);

	// Calculate the thresholds for fast-moving and slow-moving items based on filtered items
	const totalItems = filteredReport.length;
	const fastMovingThreshold = Math.floor(0.2 * totalItems); // Consider top 20% as fast-moving
	const slowMovingThreshold = Math.floor(0.2 * totalItems); // Consider bottom 20% as slow-moving

	// Sort the report based on sales velocity
	filteredReport.sort((a, b) => b.salesVelocity - a.salesVelocity);

	// Categorize the items
	const categorizedItems = filteredReport.map((item, index) => {
		if (item.salesVelocity > 0) {
			if (index < fastMovingThreshold) {
				item.movementCategory = "Fast-Moving";
			} else if (index >= totalItems - slowMovingThreshold) {
				item.movementCategory = "Slow-Moving";
			} else {
				item.movementCategory = "Medium-Moving";
			}
			return item;
		} else {
			item.movementCategory = "Zero-Moving";
			return item;
		}
	});

	res.json(categorizedItems);
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
	generateWeeklyOrderReport,
	generateMonthlyOrderReport,
	generateBatchesExpirationReport,
	generateQuarterlySalesVelocityReport,
	generateMonthlySalesVelocityReport,
};
