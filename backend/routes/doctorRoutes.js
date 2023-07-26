const express = require("express");
const router = express.Router();

const {
    createTransaction,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordDetails,
    getAllTransactions,
    getAllRecords,
    getTransactionDetails,
    updateTransaction,
    deleteTransaction,
    createAppointment,
    getAllAppointments,
    getAppointmentDetails,
    updateAppointment,
    deleteAppointment
  } = require("../controllers/doctorController");

const validateToken = require("../middleware/validateTokenHandler");
const restrictToDoctor = require("../middleware/restrictToDoctor");

router.use(validateToken);
router.use(restrictToDoctor);

router.route("/transactions")
    .post(createTransaction)
    .get(getAllTransactions)

router.route("/transactions/:id")
    .get(getTransactionDetails)
    .put(updateTransaction)
    .delete(deleteTransaction)

router.route("/records")
    .post(addRecord)
    .get(getAllRecords)

router.route("/records/:id")
    .get(getRecordDetails)
    .put(updateRecord)
    .delete(deleteRecord)

router.route("/appointments")
.post(createAppointment)
.get(getAllAppointments)

router.route("/appointments/:id")
    .get(getAppointmentDetails)
    .put(updateAppointment)
    .delete(deleteAppointment)

module.exports = router;