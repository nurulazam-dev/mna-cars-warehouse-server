const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

router.get("/", verifyToken, checkRole("admin"), userController.getUsers);
router.put("/:id", verifyToken, checkRole("admin"), userController.updateUser);
router.delete(
  "/:id",
  verifyToken,
  checkRole("admin"),
  userController.deleteUser
);

router.put("/settings", verifyToken, userController.updateSettings);

module.exports = router;
