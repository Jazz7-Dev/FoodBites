const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/profile/password", auth, changePassword);
router.delete("/profile", auth, deleteAccount);

module.exports = router;
