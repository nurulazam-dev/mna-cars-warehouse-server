import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

export const addWishlist = async (req, res) => {
  try {
    const wishlist = await getCollection("wishlist");
    const { email, title, productId } = req.body;

    const exists = await wishlist.findOne({ email, productId });
    if (exists) {
      return res.status(400).json({ message: "Item already in wishlist." });
    }

    const result = await wishlist.insertOne({ email, title, productId });

    if (result.insertedId) {
      return res.status(201).json({ message: "Added to wishlist." });
    } else {
      return res.status(500).json({ message: "Failed to add to wishlist." });
    }
  } catch (error) {
    console.error("Wishlist Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getWishlist = async (req, res) => {
  const wishlists = await getCollection("wishlists")
    .find({ email: req.params.email })
    .toArray();
  res.send(wishlists);
};

export const deleteWishlist = async (req, res) => {
  const result = await getCollection("wishlists").deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
};
