const express = require("express");
const router = express.Router();

const {
	createPatient,
	getAllPatients,
	getPatientDetails,

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
	getAppointmentDetails,
	updateAppointment,
	deleteAppointment,

	addDoctorSchedule,
	getDoctorSchedule,
	getScheduleDetails,
	updateDoctorSchedule,
	deleteDoctorSchedule,
} = require("../controllers/doctorController");

const validateToken = require("../middleware/validateTokenHandler");
const restrictToDoctor = require("../middleware/restrictToDoctor");

router.use(validateToken);
router.use(restrictToDoctor);

router.route("/patient").post(createPatient).get(getAllPatients);
router.route("/patient/:id").get(getPatientDetails);

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

module.exports = router;
