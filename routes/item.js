import express from "express";
const router = express.Router();
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware.js";

router.get("/", verifyToken, getItems);
router.get("/:id", verifyToken, getItem);
router.post("/", verifyToken, verifyAdmin, createItem);
router.put("/:id", verifyToken, verifyAdmin, updateItem);
router.delete("/:id", verifyToken, verifyAdmin, deleteItem);

export default router;
