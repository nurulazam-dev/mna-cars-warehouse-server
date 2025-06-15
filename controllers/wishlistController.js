import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

export const addWishlist = async (req, res) => {
  const result = await getCollection("wishlists").insertOne(req.body);
  res.send(result);
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
