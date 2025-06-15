import express from "express";
const router = express.Router();
import {
  getUsers,
  updateUser,
  deleteUser,
  updateSettings,
} from "../controllers/userController.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.get("/", verifyToken, checkRole("admin"), getUsers);
router.put("/:id", verifyToken, checkRole("admin"), updateUser);
router.delete("/:id", verifyToken, checkRole("admin"), deleteUser);
router.put("/settings", verifyToken, updateSettings);

export default router;
