const express = require("express");
const router = express.Router();

const {
  registerStaff,
  getStaff,
  getUserById,
  updateStaff,  
  deleteUser
} = require("../controllers/adminController");

const validateToken = require("../middleware/validateTokenHandler");
const restrictToAdmin = require("../middleware/restrictToAdmin");

router.use(validateToken);
router.use(restrictToAdmin);

router.post("/register", registerStaff);

router.get("/staff", getStaff);
router.route("/:id")
    .get(getUserById)
    .put(updateStaff)
    .delete(deleteUser)    

module.exports = router;
