const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

router.get("/stats", verifyToken, verifyAdmin, getAdminStats);

module.exports = router;
