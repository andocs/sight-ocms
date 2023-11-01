const express = require("express");
const router = express.Router();

const {
	createPatient,
	getAllPatients,
	getPatientDetails,
	getPatientHistory,

	createVisit,
	getVisitList,
	getVisitDetails,
	updateVisit,
	deleteVisit,

	createOrder,
	getAllOrders,
	getOrderDetails,
	updateOrder,
	deleteOrder,

	addRecord,
	getRecordDetails,
	getAllRecords,
	updateRecord,
	deleteRecord,

	createAppointment,
	getAllAppointments,
	getPendingAppointments,
	getScheduledAppointments,
	getConfirmedAppointments,
	getAppointmentDetails,
	updateAppointment,
	deleteAppointment,

	addDoctorSchedule,
	getDoctorSchedule,
	getDoctorScheduleDays,
	getScheduleDetails,
	updateDoctorSchedule,
	deleteDoctorSchedule,
	addBreak,
	getBreakList,
	getBreakDetails,
	updateBreak,
	deleteBreak,

	getInventoryList,

	addRepairRequest,
	getRepairList,
	getPendingRepairs,
	getRepairDetails,
	updateRepairRequest,
	deleteRepairRequest,
} = require("../controllers/doctorController");

const validateToken = require("../middleware/validateTokenHandler");
const restrictToDoctor = require("../middleware/restrictToDoctor");

router.use(validateToken);
router.use(restrictToDoctor);

router.route("/patient").post(createPatient).get(getAllPatients);
router.route("/patient/:id").get(getPatientDetails);
router.route("/patient/history/:id").get(getPatientHistory);

router.route("/visit").get(getVisitList);

router
	.route("/visit/:id")
	.post(createVisit)
	.get(getVisitDetails)
	.put(updateVisit)
	.delete(deleteVisit);

router.route("/order").get(getAllOrders);

router
	.route("/order/:id")
	.post(createOrder)
	.get(getOrderDetails)
	.put(updateOrder)
	.delete(deleteOrder);

router.route("/records").get(getAllRecords);

router
	.route("/records/:id")
	.post(addRecord)
	.get(getRecordDetails)
	.put(updateRecord)
	.delete(deleteRecord);

router.route("/appointments").get(getAllAppointments);

router.route("/pending").get(getPendingAppointments);
router.route("/scheduled").get(getScheduledAppointments);
router.route("/confirmed").get(getConfirmedAppointments);

router
	.route("/appointments/:id")
	.post(createAppointment)
	.get(getAppointmentDetails)
	.put(updateAppointment)
	.delete(deleteAppointment);

router.route("/schedule").post(addDoctorSchedule).get(getDoctorSchedule);

router
	.route("/schedule/:id")
	.get(getScheduleDetails)
	.put(updateDoctorSchedule)
	.delete(deleteDoctorSchedule);

router.route("/breaks").post(addBreak).get(getBreakList);

router
	.route("/breaks/:id")
	.get(getBreakDetails)
	.put(updateBreak)
	.delete(deleteBreak);

router.route("/available").get(getDoctorScheduleDays);

router.route("/inventory").get(getInventoryList);

router.route("/repair").get(getRepairList);
router.route("/pending/repair").get(getPendingRepairs);
router
	.route("/repair/:id")
	.post(addRepairRequest)
	.get(getRepairDetails)
	.put(updateRepairRequest)
	.delete(deleteRepairRequest);

module.exports = router;
