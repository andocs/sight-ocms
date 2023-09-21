const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../client/public/images/uploads");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
	},
});

const uploader = multer({ storage });

const upload = uploader.single("image");

const {
	registerUser,
	loginUser,

	addInfo,
	getUserById,
	updateInfo,
	changePassword,
} = require("../controllers/userController");

const validateToken = require("../middleware/validateTokenHandler");

router.post("/register", registerUser);

router.post("/login", loginUser);

router
	.route("/")
	.get(validateToken, getUserById)
	.post(validateToken, addInfo)
	.put(validateToken, upload, updateInfo);

router.put("/change-password", validateToken, changePassword);

module.exports = router;
