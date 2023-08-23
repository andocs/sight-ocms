const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const fs = require("fs");

const AuditLog = require("../models/auditLogModel");

const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const Maintenance = require("../models/maintenanceModel");

const sessionOptions = {
	readConcern: { level: "snapshot" },
	writeConcern: { w: "majority" },
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
	const staff = await User.find({ role: { $in: ["doctor", "technician"] } });
	if (staff == {}) {
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
	const updates = req.body;

	const staff = await User.findOne({
		_id: staffId,
		role: { $in: ["doctor", "technician"] },
	});

	if (!staff) {
		return res
			.status(404)
			.json({ message: "Staff account not found or unauthorized!" });
	}

	const session = await User.startSession(sessionOptions);
	try {
		session.startTransaction();

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
				role: { $in: ["doctor", "technician"] },
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
		throw error;
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
	const { itemName, quantity, price, description } = req.body;

	if (!itemName || !quantity || !price || !description) {
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const existingItem = await Inventory.findOne({ itemName });

	if (existingItem) {
		return res
			.status(400)
			.json({ message: "Item with the same name already exists!" });
	}

	const session = await Inventory.startSession(sessionOptions);
	try {
		session.startTransaction();

		const inventoryItem = await Inventory.create(
			[
				{
					itemName,
					quantity,
					price,
					description,
				},
			],
			{ session }
		);

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
		if (error.name === "ValidationError") {
			const validationErrors = [];
			for (const field in error.errors) {
				validationErrors.push({
					fieldName: field,
					message: error.errors[field].message,
				});
			}
			console.log(validationErrors);
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
	if (inventoryList == {}) {
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
		return res.status(404).json({ message: "Item not found!" });
	}

	const session = await Inventory.startSession(sessionOptions);
	try {
		session.startTransaction();

		const updatedItem = await Inventory.findByIdAndUpdate(
			itemId,
			updatedFields,
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
			message: `Item ${item.itemName} succesfully updated!`,
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
	const maintenanceRequests = await Maintenance.find();
	if ((maintenanceRequests = {})) {
		return res.json({ message: "No items currently in inventory." });
	}
	res.json(maintenanceRequests);
});

//@desc GET MAINTENANCE REQUEST DETAILS
//@route GET /api/admin/maintenance/:id
//@access private (admin only)
const getMaintenanceRequestDetails = asyncHandler(async (req, res) => {
	const requestId = req.params.id;
	const maintenanceRequest = await Maintenance.findOne({ _id: requestId });
	if (!maintenanceRequest) {
		return res.status(404).json({ message: "Item not found!" });
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
	const auditLogs = await AuditLog.find();
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
	deleteItem,

	getMaintenanceList,
	getMaintenanceRequestDetails,
	updateRequestStatus,

	getAuditLogs,
	getAuditLogDetails,
};
