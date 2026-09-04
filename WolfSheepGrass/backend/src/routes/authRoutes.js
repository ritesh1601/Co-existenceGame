const express = require("express");
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");



const router = express.Router();

router.post("/google", authController.googleLogin);
router.get("/me", authenticateToken, authController.getCurrentUser);

module.exports = router;