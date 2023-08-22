const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "All fields are mandatory!" });
	}
	const userExists = await User.findOne({ email });
	if (userExists) {
		return res.status(400).json({ message: "User already exists!" });
	}
	//Hash password function
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const user = await User.create({
			email,
			password: hashedPassword,
			role: "patient",
		});
		res
			.status(201)
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
	}
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

	//compare password with hashedPassword
	if (user && (await bcrypt.compare(password, user.password))) {
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

	user.personalInfo = {
		fname,
		lname,
		contact,
		address,
		city,
		province,
		postal,
	};
	user.isPersonalInfoComplete = true;
	await user.save();

	res.json(user);
});

//@desc Update User Info
//@route PUT /api/users
//@access private (user with the same ID only)
const updateInfo = asyncHandler(async (req, res) => {
	const userId = req.user.id;

	const { fname, lname, contact, address, city, province, postal } = req.body;

	const updatedFields = {};
	if (fname) updatedFields["personalInfo.fname"] = fname;
	if (lname) updatedFields["personalInfo.lname"] = lname;
	if (contact) updatedFields["personalInfo.contact"] = contact;
	if (address) updatedFields["personalInfo.address"] = address;
	if (city) updatedFields["personalInfo.city"] = city;
	if (province) updatedFields["personalInfo.province"] = province;
	if (postal) updatedFields["personalInfo.postal"] = postal;

	const user = await User.findByIdAndUpdate(userId, updatedFields, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		res.status(404);
		throw new Error("User not found!");
	}

	res.json(user);
});

//@desc Change User Email
//@route PUT /api/users/change-email
//@access private (user with the same ID only)
const changeEmail = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	const newEmail = req.body;

	const user = await User.findByIdAndUpdate(userId, newEmail, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		res.status(404);
		throw new Error("User not found!");
	}

	res.json(user);
});

//@desc Change User Password
//@route PUT /api/users/change-password
//@access private (user with the same ID only)
const changePassword = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	const { password } = req.body;

	const user = await User.findById(userId);

	if (!user) {
		res.status(404);
		throw new Error("User not found!");
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	user.password = hashedPassword;
	await user.save();

	res.json(user);
});

module.exports = {
	registerUser,
	loginUser,
	addInfo,
	updateInfo,
	getUserById,
	changeEmail,
	changePassword,
};
