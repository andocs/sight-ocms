const express = require("express");
const router = express.Router();

const {
	getRecords,
	getRecordDetails,

	getAllOrders,
	getOrderDetails,

	scheduleAppointment,
	getAllAppointments,
	getPendingAppointments,
	getAppointmentDetails,

	getDoctorList,
	getDoctorSchedule,
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

router.route("/doctor").get(getDoctorList);
router.route("/schedule").get(getDoctorSchedule);

module.exports = router;
