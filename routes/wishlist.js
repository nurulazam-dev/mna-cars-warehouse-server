import express from "express";
const router = express.Router();
import {
  addWishlist,
  getWishlist,
  deleteWishlist,
  clearWishlistHandler,
} from "../controllers/wishlistController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post("/", verifyToken, addWishlist);
router.get("/:email", verifyToken, getWishlist);
router.delete("/:id", verifyToken, deleteWishlist);
router.delete("/clear/:email", verifyToken, clearWishlistHandler);

export default router;
