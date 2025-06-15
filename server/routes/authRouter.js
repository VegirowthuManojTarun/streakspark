const router = require("express").Router();
const {
  googleLogin,
  logout,
  getCurrentUser,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// OAuth callback
router.get("/google", googleLogin);

// Get current user
router.get("/me", protect, getCurrentUser);

// Logout
router.get("/logout", logout);

module.exports = router;
