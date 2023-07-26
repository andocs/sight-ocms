const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

//@desc Register user
//@route POST /api/admin/register
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

    if (!fname ||
        !lname ||
        !gender ||
        !email ||
        !contact ||
        !address ||
        !city ||
        !province ||
        !password ||
        !role
    ){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userExists = await User.findOne({ email });
    if(userExists){
        res.status(400).json("User already exists!");
        throw new Error("User already exists!");
    }
    //Hash password function
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword); 
    
    const user = await User.create({
        fname,
        lname, 
        gender,
        email,
        contact,
        address,
        city,
        province,
        password: hashedPassword,
        role
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({ _id: user.id, email: user.email, role: user.role});
    } else{
        res.status(400).json("User data is not valid");
        throw new Error("User data is not valid");
    }
});

//@desc Get staff by Role
//@route GET /api/admin/staff
//@access private (admin only)
const getStaff = asyncHandler(async (req, res) => {
    const users = await User.find({ role: { $in: ['doctor', 'technician'] } });
    if (!users){
        res.status(404);
        throw new Error("User not found");
    }
    res.json(users);
  });

//@desc Get user by ID
//@route GET /api/admin/:id
//@access Private (admin only)
const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
  
    const user = await User.findById(userId);
  
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user)
  });

//@desc Update user
//@route PUT /api/admin/:id
//@access private (admin only)
const updateStaff = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    if (updates.password){
        const hashedPassword = await bcrypt.hash(updates.password, 10);
        updates.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });
  
    if (!user) {
      res.status(404);
      throw new Error("Staff account not found");
    }
    
    res.json(user);
    console.log(user);
  });

//@desc Delete user
//@route DELETE /api/admin/:id
//@access private (admin only)
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    // Delete the user
    await user.deleteOne()

    res.json({ message: "User deleted" });
    });



module.exports = {
    registerStaff,
    getUserById,
    updateStaff,
    getStaff,
    deleteUser
 };