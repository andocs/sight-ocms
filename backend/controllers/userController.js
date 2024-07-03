const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AuditLog = require("../models/auditLogModel");
const Appointment = require("../models/appointmentModel");
const Schedule = require("../models/scheduleModel");

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
		if (password !== conf_pass) {
			return res.status(400).json({ message: "Passwords do not match!" });
		}

		if (userExists.password && userExists.isRegistered) {
			return res.status(400).json({ message: "User already exists!" });
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
						userId: userExists._id,
						operation: "update",
						entity: "User",
						entityId: userExists._id,
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
	} else {
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
	}
});

//@desc Login User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email) {
		return res.status(400).json({ message: "Please enter an email!" });
	}

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(401).json({ message: "Wrong email!" });
	}

	if (!user.password) {
		return res.status(400).json({
			message: "Please set a password to complete your registration.",
		});
	}

	if (!password) {
		return res.status(400).json({ message: "All fields are mandatory!" });
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
					message: `You have successfully logged in ${user.email}`,
				});
			}
		} else {
			return res.status(401).json({ message: "Wrong password!" });
		}
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
			data: updatedUser,
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

	if (!oldPassword || !newPassword || !confPassword) {
		return res
			.status(404)
			.json({ message: "Please fill in all the required fields!" });
	}

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "User not found!" });
	}

	if (!(await bcrypt.compare(oldPassword, user.password))) {
		return res.status(404).json({ message: "You entered the wrong password" });
	}

	if (await bcrypt.compare(newPassword, user.password)) {
		return res.status(404).json({ message: "You are using an old password!" });
	}

	if (newPassword !== confPassword) {
		return res.status(404).json({ message: "New passwords do not match!" });
	}

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

			res.status(201).json({
				data: updatedUser,
				message: "Your account's password is successfully updated!",
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
			return res.status(400).json({ message: error });
		}
		session.endSession();
	}
});

//@desc GET LIST OF DOCTOR'S SCHEDULE
//@route GET /api/user/schedule
//@access public
const getDoctors = asyncHandler(async (req, res) => {
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

module.exports = {
	registerUser,
	loginUser,
	addInfo,
	updateInfo,
	getUserById,
	changePassword,
	getDoctors,
};
