import express from "express";
const router = express.Router();
import {
  addWishlist,
  getWishlist,
  deleteWishlist,
} from "../controllers/wishlistController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.post("/", verifyToken, addWishlist);
router.get("/:email", verifyToken, getWishlist);
router.delete("/:id", verifyToken, deleteWishlist);

export default router;
