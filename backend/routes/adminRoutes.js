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
} = require("../controllers/adminController");

const validateToken = require("../middleware/validateTokenHandler");
const restrictToAdmin = require("../middleware/restrictToAdmin");

router.use(validateToken);
router.use(restrictToAdmin);

router.route("/staff").post(upload, registerStaff).get(getStaffList);

router
	.route("/staff/:id")
	.get(getStaffDetails)
	.put(upload, updateStaff)
	.delete(deleteUser);

router.route("/inventory").post(addInventoryItem).get(getInventoryList);

router
	.route("/inventory/:id")
	.get(getItemDetails)
	.put(updateItem)
	.delete(deleteItem);

router.get("/maintenance", getMaintenanceList);

router
	.route("/maintenance/:id")
	.get(getMaintenanceRequestDetails)
	.put(updateRequestStatus);

router.get("/log", getAuditLogs);

router.get("/log/:id", getAuditLogDetails);

module.exports = router;
