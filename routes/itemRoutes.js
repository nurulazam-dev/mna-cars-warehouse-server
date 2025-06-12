const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", verifyToken, itemController.getItems);
router.get("/:id", verifyToken, itemController.getItem);
router.post("/", verifyToken, itemController.createItem);
router.put("/:id", verifyToken, itemController.updateItem);
router.delete("/:id", verifyToken, itemController.deleteItem);

module.exports = router;
