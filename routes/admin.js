import express from "express";
const router = express.Router();
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import { getAdminStats } from "../controllers/adminController.js";

router.get("/stats", verifyToken, verifyAdmin, getAdminStats);

export default router;
