const express = require("express");
const {  
    registerUser,
    loginUser,
    updateInfo,
    getUserById,       
    addInfo,
    changeEmail,
    changePassword
 } = require("../controllers/userController");

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.route("/")
    .get(validateToken, getUserById)
    .post(validateToken, addInfo)
    .put(validateToken, updateInfo)

router.put("/change-email", validateToken, changeEmail)

router.put("/change-password", validateToken, changePassword)

module.exports = router;