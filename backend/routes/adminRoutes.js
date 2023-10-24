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

router.route("/inventory").post(upload, addInventoryItem).get(getInventoryList);

router
	.route("/inventory/:id")
	.get(getItemDetails)
	.put(upload, updateItem)
	.delete(deleteItem);

router.route("/restock/:id").put(restockItem);

router.get("/maintenance", getMaintenanceList);
router.get("/pending", getPendingRequests);

router
	.route("/maintenance/:id")
	.get(getMaintenanceRequestDetails)
	.put(updateRequestStatus);

router.get("/log", getAuditLogs);

router.get("/log/:id", getAuditLogDetails);

router.get("/report/technician/weekly", generateWeeklyTechnicianReport);
router.get("/report/technician/monthly", generateMonthlyTechnicianReport);
router.get("/report/doctor/weekly", generateWeeklyDoctorReport);
router.get("/report/doctor/monthly", generateMonthlyDoctorReport);

router.get("/report/inventory", generateInventoryReport);
router.get("/report/order/weekly", generateWeeklyOrderReport);
router.get("/report/order/monthly", generateMonthlyOrderReport);
router.get("/report/batches", generateBatchesExpirationReport);
router.get("/report/sales/monthly", generateMonthlySalesVelocityReport);
router.get("/report/sales/quarterly", generateQuarterlySalesVelocityReport);

module.exports = router;
