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

router.post("/checkout-session", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.put("/:id", verifyToken, updateOrder);
router.get("/:email", verifyToken, getOrdersByEmail);
router.delete("/:id", verifyToken, deleteOrder);

export default router;
