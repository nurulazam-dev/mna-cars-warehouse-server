const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

exports.addWishlist = async (req, res) => {
  const result = await getCollection("wishlists").insertOne(req.body);
  res.send(result);
};

exports.getWishlist = async (req, res) => {
  const wishlists = await getCollection("wishlists")
    .find({ email: req.params.email })
    .toArray();
  res.send(wishlists);
};

exports.deleteWishlist = async (req, res) => {
  const result = await getCollection("wishlists").deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
};
