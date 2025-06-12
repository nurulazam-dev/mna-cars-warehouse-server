const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/", verifyToken, wishlistController.addWishlist);
router.get("/:email", verifyToken, wishlistController.getWishlist);
router.delete("/:id", verifyToken, wishlistController.deleteWishlist);

module.exports = router;
