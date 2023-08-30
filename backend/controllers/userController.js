const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AuditLog = require("../models/auditLogModel");

const sessionOptions = {
	readConcern: { level: "snapshot" },
	writeConcern: { w: "majority" },
};

//@desc Register User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
	const { email, password, conf_pass } = req.body;

	if (!email || !password || !conf_pass) {
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const userExists = await User.findOne({ email });
	if (userExists) {
		console.log(userExists);
		if (userExists.password && userExists.isRegistered === true) {
			return res.status(400).json({ message: "User already exists!" });
		} else {
			if (password !== conf_pass) {
				return res.status(400).json({ message: "Passwords do not match!" });
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const updates = {
				password: hashedPassword,
				isRegistered: true,
			};
			const session = await User.startSession(sessionOptions);
			try {
				session.startTransaction();
				const updatedUser = await User.findByIdAndUpdate(
					userExists._id,
					updates,
					{
						new: true,
						runValidators: true,
						session,
					}
				);

				await AuditLog.create(
					[
						{
							userId: userExists[0]._id,
							operation: "update",
							entity: "User",
							entityId: userExists[0]._id,
							oldValues: userExists,
							newValues: updatedUser,
							userIpAddress: req.ip,
							userAgent: req.get("user-agent"),
							additionalInfo: "User Account registered",
						},
					],
					{ session }
				);
				await session.commitTransaction();
				return res.status(201).json({
					data: updatedUser,
					message: "Account successfully registered!",
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
		}
	}
	//Hash password function
	if (password !== conf_pass) {
		return res.status(400).json({ message: "Passwords do not match!" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const session = await User.startSession(sessionOptions);
	try {
		session.startTransaction();
		const user = await User.create(
			[
				{
					email,
					password: hashedPassword,
					role: "patient",
					isRegistered: true,
				},
			],
			{ session }
		);
		await AuditLog.create(
			[
				{
					userId: user[0]._id,
					operation: "create",
					entity: "User",
					entityId: user[0]._id,
					oldValues: null,
					newValues: user[0],
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "New staff account added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res
			.status(200)
			.json({ data: user, message: `Account successfully created!` });
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

//@desc Login User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: "All fields are mandatory!" });
	}
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(401).json({ message: "User not found!" });
	}

	if (user.password) {
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{
					user: {
						name: user.personalInfo.fname + " " + user.personalInfo.lname,
						role: user.role,
						id: user.id,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "1w" }
			);
			if (user.role !== "patient") {
				const rolestr = user.role.charAt(0).toUpperCase() + user.role.slice(1);
				res.status(200).json({
					data: token,
					message: `You have successfully logged in ${rolestr} ${user.personalInfo.fname} ${user.personalInfo.lname}`,
				});
			} else {
				res.status(200).json({
					data: token,
					message: `You have successfully logged in ${user.personalInfo.fname} ${user.personalInfo.lname}`,
				});
			}
		} else {
			return res.status(401).json({ message: "Wrong email or password!" });
		}
	} else {
		return res.status(200).json({
			message: "Please set a password to complete your registration.",
		});
	}
});

//@desc Get User by ID
//@route GET /api/users
//@access Private (user with the same ID only)
const getUserById = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	res.json(user);
});

//@desc Add User Info
//@route POST /api/users
//@access private (user with the same ID only)
const addInfo = asyncHandler(async (req, res) => {
	const userId = req.user.id;

	const { fname, lname, contact, address, city, province, postal } = req.body;

	if (
		!fname ||
		!lname ||
		!contact ||
		!address ||
		!city ||
		!province ||
		!postal
	) {
		return res.status(400).json({ message: "All fields are mandatory!" });
	}

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "User not found!" });
	}

	personalInfo = {
		fname,
		lname,
		contact,
		address,
		city,
		province,
		postal,
	};

	const updates = {
		personalInfo,
		isPersonalInfoComplete: true,
	};

	const session = await User.startSession(sessionOptions);
	try {
		session.startTransaction();

		const updatedUser = await User.findByIdAndUpdate(userId, updates, {
			new: true,
			runValidators: true,
			session,
		});

		await AuditLog.create(
			[
				{
					userId: userId,
					operation: "update",
					entity: "User",
					entityId: userId,
					oldValues: user,
					newValues: updatedUser,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "User Information added",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedStaff,
			message: `${fname} ${lname}'s account is successfully updated!`,
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

//@desc Update User Info
//@route PUT /api/users
//@access private (user with the same ID only)
const updateInfo = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	let updates = req.body;

	if (updates.personalInfo) {
		updates.personalInfo = JSON.parse(updates.personalInfo);
	}

	const user = await User.findOne({
		_id: userId,
	});

	if (!user) {
		if (req.file) {
			fs.unlinkSync(req.file.path);
		}
		return res
			.status(404)
			.json({ message: "User account not found or unauthorized!" });
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

		const updatedUser = await User.findByIdAndUpdate(userId, updates, {
			new: true,
			runValidators: true,
			session,
		});
		await AuditLog.create(
			[
				{
					userId: userId,
					operation: "update",
					entity: "User",
					entityId: userId,
					oldValues: user,
					newValues: updatedUser,
					userIpAddress: req.ip,
					userAgent: req.get("user-agent"),
					additionalInfo: "User Account updated",
				},
			],
			{ session }
		);
		await session.commitTransaction();
		res.status(201).json({
			data: updatedStaff,
			message: "Your account has successfully been updated!",
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

//@desc Change User Password
//@route PUT /api/users/change-password
//@access private (user with the same ID only)
const changePassword = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	const { oldPassword, newPassword, confPassword } = req.body;

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "User not found!" });
	}

	if (await bcrypt.compare(oldPassword, user.password)) {
		if (newPassword === confPassword) {
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			const updates = {
				password: hashedPassword,
			};

			const session = await User.startSession(sessionOptions);
			try {
				session.startTransaction();

				const updatedUser = await User.findByIdAndUpdate(userId, updates, {
					new: true,
					runValidators: true,
					session,
				});

				await AuditLog.create(
					[
						{
							userId: userId,
							operation: "update",
							entity: "User",
							entityId: userId,
							oldValues: user,
							newValues: updatedUser,
							userIpAddress: req.ip,
							userAgent: req.get("user-agent"),
							additionalInfo: "User Information added",
						},
					],
					{ session }
				);
				await session.commitTransaction();
				res.status(201).json({
					data: updatedStaff,
					message: `${user.fname} ${user.lname}'s password is successfully updated!`,
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
		} else {
			return res.status(404).json({ message: "New passwords do not match!" });
		}
	} else if (await bcrypt.compare(newPassword, user.password)) {
		return res.status(404).json({ message: "You are using an old password!" });
	} else {
		return res.status(404).json({ message: "You entered the wrong password!" });
	}
});

module.exports = {
	registerUser,
	loginUser,
	addInfo,
	updateInfo,
	getUserById,
	changePassword,
};
