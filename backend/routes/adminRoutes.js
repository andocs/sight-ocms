const express = require("express");
const router = express.Router();

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

router.route("/staff")
    .post(registerStaff)
    .get(getStaffList)
    
router.route("/staff/:id")
    .get(getStaffDetails)
    .put(updateStaff)
    .delete(deleteUser)
    
router.route("/inventory")
    .post(addInventoryItem)
    .get(getInventoryList)
    
router.route("/inventory/:id")
    .get(getItemDetails)
    .put(updateItem)
    .delete(deleteItem)

router.get("/maintenance", getMaintenanceList)
    
router.route("/maintenance/:id")
    .get(getMaintenanceRequestDetails)
    .put(updateRequestStatus)

router.get("/log", getAuditLogs)

router.get("/log/:id", getAuditLogDetails)

module.exports = router;
