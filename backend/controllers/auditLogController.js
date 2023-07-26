const asyncHandler = require("express-async-handler");
const AuditLog = require("../models/auditLogModel");

//@desc Get all audit logs
//@route GET /api/auditlog
//@access private (admin only)
const getAllAuditLogs = asyncHandler(async (req, res) => {
  const auditLogs = await AuditLog.find();
  res.json(auditLogs);
});

//@desc Get audit log details
//@route GET /api/auditlog/:id
//@access private (admin only)
const getAuditLogDetails = asyncHandler(async (req, res) => {
  const auditLogId = req.params.id;

  const auditLog = await AuditLog.findById(auditLogId);

  if (!auditLog) {
    res.status(404);
    throw new Error("Audit log not found!");
  }
  res.json(auditLog);
});

module.exports = {
  getAllAuditLogs,
  getAuditLogDetails
};
