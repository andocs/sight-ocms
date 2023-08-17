const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const AuditLog = require("../models/auditLogModel");

const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const Maintenance = require("../models/maintenanceModel");

const sessionOptions = { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" }  }

/**
##### STAFF MANAGEMENT (CRUD) #####
**/

//@desc REGISTER NEW STAFF ACCOUNT
//@route POST /api/admin/staff
//@access private (admin only)
const registerStaff = asyncHandler(async (req, res) => {
    const {
        fname,
        lname,
        gender,
        email,
        contact,
        address,
        city,
        province,  
        password, 
        role
    } = req.body;

    if (!fname || !lname || !gender || !email ||
        !contact || !address || !city || !province ||
        !password || !role)
        {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });
    if(user){
        res.status(400)
        throw new Error("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword); 

    const personalInfo = {
        fname,
        lname, 
        gender,
        contact,
        address,
        city,
        province
    }

    const session = await User.startSession(sessionOptions);
    try{
        session.startTransaction();

        const staff = await User.create(
            [{
                email,
                password: hashedPassword,
                role,
                isPersonalInfoComplete: true,
                personalInfo
            }],
            { session }
        );
        
        await AuditLog.create(
            [{
            userId: req.user.id,
            operation: 'create',
            entity: 'User',
            entityId: staff[0]._id,
            oldValues: null,
            newValues: staff[0],
            userIpAddress: req.ip,
            userAgent: req.get('user-agent'),
            additionalInfo: 'New staff account added'
            }],
            { session }
        );
        await session.commitTransaction();
        res.status(201).json(staff);
    }
    catch(error){
        await session.abortTransaction();
        throw error
    }
    session.endSession();
});

//@desc GET LIST OF ALL STAFF
//@route GET /api/admin/staff
//@access private (admin only)
const getStaffList = asyncHandler(async (req, res) => {
    const staff = await User.find({ role: { $in: ['doctor', 'technician'] } });
    if (!staff){
        res.status(404);
        throw new Error("User not found");
    }
    res.json(staff);
});

//@desc GET STAFF ACCOUNT DETAILS
//@route GET /api/admin/staff/:id
//@access Private (admin only)
const getStaffDetails = asyncHandler(async (req, res) => {
    const staffId = req.params.id;
    const staff = await User.findById(staffId);
    if (!staff) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(staff)
});

//@desc UPDATE EXISTING STAFF ACCOUNT
//@route PUT /api/admin/staff/:id
//@access private (admin only)
const updateStaff = asyncHandler(async (req, res) => {
    const staffId = req.params.id;
    const updates = req.body;

    const staff = await User.findOne({
        _id: staffId,
        role: { $in: ['doctor', 'technician'] }
    });

    if (!staff) {
        res.status(404);
        throw new Error('Staff account not found or unauthorized!');
    }

    if (updates.password){
        const hashedPassword = await bcrypt.hash(updates.password, 10);
        updates.password = hashedPassword;
    }

    const session = await User.startSession(sessionOptions);
    try{
        session.startTransaction();

        const updatedStaff = await User.findByIdAndUpdate(
          staffId, 
          updates, 
          { new: true, runValidators: true, session }
        );

        await AuditLog.create(
            [{
            userId: req.user.id,
            operation: 'update',
            entity: 'User',
            entityId: staffId,
            oldValues: staff,
            newValues: updatedStaff,
            userIpAddress: req.ip,
            userAgent: req.get('user-agent'),
            additionalInfo: 'Staff Account updated'
            }],
            { session }
        );
        await session.commitTransaction();
        res.status(201).json(updatedStaff);
    }
    catch(error){
        await session.abortTransaction();
        throw error
    }
    session.endSession();
});

//@desc DELETE STAFF ACCOUNT
//@route DELETE /api/admin/staff/:id
//@access private (admin only)
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const session = await User.startSession(sessionOptions);
    try{
        session.startTransaction();

        const staff = await User.findOneAndDelete({
            _id: userId,
            role: { $in: ['doctor', 'technician'] }
        },
        { session });

        if (!staff) {
            res.status(404);
            throw new Error("User not found or unauthorized!");
        };

        await AuditLog.create(
            [{
            userId: req.user.id,
            operation: 'delete',
            entity: 'User',
            entityId: userId,
            oldValues: staff,
            newValues: null,
            userIpAddress: req.ip,
            userAgent: req.get('user-agent'),
            additionalInfo: 'Staff Account deleted'
            }],
            { session }
        );
        await session.commitTransaction();
        res.status(201).json('Staff Account deleted successfully');
    }
    catch(error){
        await session.abortTransaction();
        throw error
    }
    session.endSession();
});

/**
##### INVENTORY MANAGEMENT (CRUD) #####
**/

//@desc ADD INVENTORY ITEMS
//@route POST /api/admin/inventory
//@access private (admin only)
const addInventoryItem = asyncHandler(async (req, res) => {
    const { name, quantity, price, description } = req.body;

    if (!name || !quantity || !price)
    {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const item = await Inventory.find({ name })

    if (item) {
        res.status(400);
        throw new Error('Item with the same name already exists!');
    }

    const session = await Inventory.startSession(sessionOptions);
    try{
        session.startTransaction();

        const inventoryItem = await Inventory.create(
            [{
                name,
                quantity,
                price,
                description
            }],
            { session }
        );
        
        await AuditLog.create(
            [{
            userId: req.user.id,
            operation: 'create',
            entity: 'Inventory',
            entityId: inventoryItem[0]._id,
            oldValues: null,
            newValues: inventoryItem[0],
            userIpAddress: req.ip,
            userAgent: req.get('user-agent'),
            additionalInfo: 'New Inventory Item added'
            }],
            { session }
        );
        await session.commitTransaction();
        res.status(201).json(inventoryItem);
    }
    catch(error){
        await session.abortTransaction();
        throw error
    }
    session.endSession();
});

//@desc GET INVENTORY ITEM LIST
//@route GET /api/admin/inventory
//@access private (admin only)
const getInventoryList = asyncHandler(async (req, res) => {
    const inventoryList = await Inventory.find()
    if (inventoryList = {}){
        res.json("No items currently in inventory.")
    }
    res.json(inventoryList);
});

//@desc GET INVENTORY ITEM DETAILS
//@route GET /api/admin/inventory/:id
//@access private (admin only)
const getItemDetails = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const inventoryItem = await Inventory.findOne({ _id: itemId });
    if (!inventoryItem) {
      res.status(404);
      throw new Error('Item not found!');
    }
    res.json(inventoryItem);
});

//@desc UPDATE INVENTORY ITEM
//@route PUT /api/admin/inventory/:id
//@access private (admin only)
const updateItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const updatedFields = req.body;
  
    const item = await Inventory.findOne({ _id: itemId });
  
    if (!item) {
      res.status(404);
      throw new Error('Item not found!');
    }
  
    const session = await Inventory.startSession(sessionOptions);
    try{
      session.startTransaction();
  
      const updatedItem = await Inventory.findByIdAndUpdate(
        itemId,
        updatedFields,
        { new: true, runValidators: true, session }
      );
  
      await AuditLog.create(
        [{
        userId: req.user.id,
        operation: 'update',
        entity: 'Inventory',
        entityId: itemId,
        oldValues: item,
        newValues: updatedItem,
        userIpAddress: req.ip,
        userAgent: req.get('user-agent'),
        additionalInfo: 'Inventory Item updated'
        }],
        { session }
      );
      await session.commitTransaction();
      res.status(201).json(updatedItem);
    }
    catch(error){
      await session.abortTransaction();
      throw error
    }
    session.endSession();
});

//@desc DELETE INVENTORY ITEM
//@route DELETE /api/admin/inventory/:id
//@access private (admin only)
const deleteItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
  
    const session = await Inventory.startSession(sessionOptions);
    try{
      session.startTransaction();
      
      const inventoryItem = await Inventory.findOneAndDelete({_id: itemId},{ session });
    
      if (!inventoryItem) {
        res.status(404);
        throw new Error('Item not found!');
      };
  
      await AuditLog.create(
        [{
        userId: req.user.id,
        operation: 'delete',
        entity: 'Inventory',
        entityId: itemId,
        oldValues: inventoryItem,
        newValues: null,
        userIpAddress: req.ip,
        userAgent: req.get('user-agent'),
        additionalInfo: 'Inventory Item deleted'
        }],
        { session }
      );
      await session.commitTransaction();
      res.status(201).json('Inventory Item deleted successfully');
    }
    catch(error){
      await session.abortTransaction();
      throw error
    }
    session.endSession();
});

/**
##### MAINTENANCE MANAGEMENT (READ AND UPDATE) #####
**/

//@desc GET MAINTENANCE REQUEST LIST 
//@route GET /api/admin/maintenance
//@access private (admin only)
const getMaintenanceList = asyncHandler(async (req, res) => {
    const maintenanceRequests = await Maintenance.find()
    if (maintenanceRequests = {}){
        res.json("No items currently in inventory.")
    }
    res.json(maintenanceRequests);
});

//@desc GET MAINTENANCE REQUEST DETAILS
//@route GET /api/admin/maintenance/:id
//@access private (admin only)
const getMaintenanceRequestDetails = asyncHandler(async (req, res) => {
    const requestId = req.params.id;
    const maintenanceRequest = await Maintenance.findOne({ _id: requestId });
    if (!maintenanceRequest) {
      res.status(404);
      throw new Error('Item not found!');
    }
    res.json(maintenanceRequest);
});

//@desc UPDATE MAINTENANCE REQUEST STATUS
//@route PUT /api/admin/maintenance/:id
//@access private (admin only)
const updateRequestStatus = asyncHandler(async (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;
  
    const request = await Maintenance.findOne({ _id: requestId });
  
    if (!request) {
      res.status(404);
      throw new Error('Item not found!');
    }
  
    const session = await Maintenance.startSession(sessionOptions);
    try{
      session.startTransaction();
  
      const updatedStatus = await Maintenance.findByIdAndUpdate(
        requestId,
        status,
        { new: true, runValidators: true, session }
      );
  
      await AuditLog.create(
        [{
        userId: req.user.id,
        operation: 'update',
        entity: 'Maintenance',
        entityId: requestId,
        oldValues: request,
        newValues: updatedStatus,
        userIpAddress: req.ip,
        userAgent: req.get('user-agent'),
        additionalInfo: 'Maintenance Status updated'
        }],
        { session }
      );
      await session.commitTransaction();
      res.status(201).json(updatedStatus);
    }
    catch(error){
      await session.abortTransaction();
      throw error
    }
    session.endSession();
});

/**
##### AUDIT LOGS (READ ONLY) #####
**/

//@desc GET LIST OF AUDIT LOGS
//@route GET /api/admin/log
//@access private (admin only)
const getAuditLogs = asyncHandler(async (req, res) => {
    const auditLogs = await AuditLog.find();
    res.json(auditLogs);
});

//@desc GET AUDIT LOG DETAILS
//@route GET /api/admin/log/:id
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
    getAuditLogDetails
 };