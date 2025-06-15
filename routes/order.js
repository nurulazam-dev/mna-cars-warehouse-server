import express from "express";
const router = express.Router();
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getOrders,
  getOrdersByEmail,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:email", verifyToken, getOrdersByEmail);
router.put("/:id", verifyToken, verifyAdmin, updateOrder);
router.delete("/:id", verifyToken, verifyAdmin, deleteOrder);

export default router;
