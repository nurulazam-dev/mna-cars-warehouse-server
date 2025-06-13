const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, orderController.createOrder);
router.get("/", verifyToken, orderController.getOrders);
router.get("/:email", verifyToken, orderController.getOrdersByEmail);
router.put("/:id", verifyToken, verifyAdmin, orderController.updateOrder);
router.delete("/:id", verifyToken, verifyAdmin, orderController.deleteOrder);

module.exports = router;
