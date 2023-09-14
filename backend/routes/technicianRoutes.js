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
} = require("../controllers/technicianController");

const validateToken = require("../middleware/validateTokenHandler");
const restrictToTechnician = require("../middleware/restrictToTechnician");

router.use(validateToken);
router.use(restrictToTechnician);

router.route("/order").get(getPendingOrders);

router
	.route("/order/:id")
	.get(getOrderDetails)
	.put(updateOrderStatus)
	.delete(deleteOrder);

router.route("/order-history").get(getOrderHistory);

router.route("/inventory").get(getInventoryList);

router.route("/inventory/:id").get(getItemDetails);

router
	.route("/maintenance")
	.post(upload, createMaintenanceRequest)
	.get(getMaintenanceList);

router
	.route("/maintenance/:id")
	.get(getMaintenanceRequestDetails)
	.put(upload, updateMaintenanceRequest)
	.delete(deleteRequest);

module.exports = router;
