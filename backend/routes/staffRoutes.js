const express = require("express");
const router = express.Router();

const {
	getAllAppointments,
	getPendingAppointments,
	getScheduledAppointments,
	getConfirmedAppointments,
	getAppointmentDetails,
	updateAppointment,

	getVisitList,
	getVisitDetails,

	getAllPatients,
	getPatientDetails,
	getPatientHistory,
} = require("../controllers/staffController");

const validateToken = require("../middleware/validateTokenHandler");
const restrictToStaff = require("../middleware/restrictToStaff");

router.use(validateToken);
router.use(restrictToStaff);

router.route("/appointments").get(getAllAppointments);

router
	.route("/appointments/:id")
	.get(getAppointmentDetails)
	.put(updateAppointment);

router.route("/pending").get(getPendingAppointments);
router.route("/scheduled").get(getScheduledAppointments);
router.route("/confirmed").get(getConfirmedAppointments);

router.route("/visit").get(getVisitList);

router.route("/visit/:id").get(getVisitDetails);

router.route("/patient").get(getAllPatients);
router.route("/patient/:id").get(getPatientDetails);
router.route("/patient/history/:id").get(getPatientHistory);

module.exports = router;
