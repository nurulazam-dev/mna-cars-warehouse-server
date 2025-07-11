import express from "express";
const router = express.Router();
import {
  getUsers,
  updateUser,
  deleteUser,
  updateSettings,
} from "../controllers/userController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

router.get("/", verifyToken, getUsers);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);
router.put("/:id/settings", verifyToken, updateSettings);

export default router;
