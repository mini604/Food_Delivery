const express = require("express");
const { registerUser, loginUser, verifyToken } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken);

module.exports = router;
