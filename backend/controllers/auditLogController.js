const asyncHandler = require("express-async-handler");
const AuditLog = require("../models/auditLogModel");

//@desc Create a new audit log
//@route POST /api/auditlog
//@access private (admin only)
const createAuditLog = asyncHandler(async (auditLogData) => {
  const {
    userId,
    operation,
    entity,
    entityId,
    oldValues,
    newValues,
    userIpAddress,
    userAgent,
    additionalInfo,
  } = auditLogData;

  await AuditLog.create({
    userId,
    operation,
    entity,
    entityId,
    oldValues,
    newValues,
    userIpAddress,
    userAgent,
    additionalInfo,
  });
});

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

//@desc Delete an audit log
//@route DELETE /api/auditlog/:id
//@access private (admin only)
const deleteAuditLog = asyncHandler(async (req, res) => {
  const auditLogId = req.params.id;

  const auditLog = await AuditLog.findByIdAndDelete(auditLogId);

  if (!auditLog) {
    res.status(404);
    throw new Error("Audit log not found!");
  }

  res.json({ message: "Audit log deleted successfully" });
});

module.exports = {
  createAuditLog,
  getAllAuditLogs,
  getAuditLogDetails,
  deleteAuditLog,
};
