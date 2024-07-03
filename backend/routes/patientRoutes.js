const express = require("express");
const router = express.Router();

const {
	getRecords,
	getRecordDetails,

	getAllOrders,
	getOrderDetails,

	scheduleAppointment,
	getAllAppointments,
	getConfirmedAppointments,
	getPendingAppointments,
	getAppointmentDetails,

	getDoctorList,
	getDoctorSchedule,

	getRepairHistory,
	getRepairDetails,
} = require("../controllers/patientController");

const validateToken = require("../middleware/validateTokenHandler");
const restrictToPatient = require("../middleware/restrictToPatient");

router.use(validateToken);
router.use(restrictToPatient);

router.route("/records").get(getRecords);
router.route("/records/:id").get(getRecordDetails);

router.route("/order").get(getAllOrders);
router.route("/order/:id").get(getOrderDetails);

router.route("/appointments").post(scheduleAppointment).get(getAllAppointments);
router.route("/appointments/:id").get(getAppointmentDetails);

router.route("/pending").get(getPendingAppointments);
router.route("/confirmed").get(getConfirmedAppointments);

router.route("/doctor").get(getDoctorList);
router.route("/schedule").get(getDoctorSchedule);

router.route("/repair").get(getRepairHistory);
router.route("/repair/:id").get(getRepairDetails);
module.exports = router;
