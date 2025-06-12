const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

exports.createOrder = async (req, res) => {
  const result = await getCollection("orders").insertOne(req.body);
  res.send(result);
};

exports.getOrders = async (req, res) => {
  const orders = await getCollection("orders").find({}).toArray();
  res.send(orders);
};

exports.getOrdersByEmail = async (req, res) => {
  const orders = await getCollection("orders")
    .find({ email: req.params.email })
    .toArray();
  res.send(orders);
};

exports.updateOrder = async (req, res) => {
  const result = await getCollection("orders").updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
};

exports.deleteOrder = async (req, res) => {
  const result = await getCollection("orders").deleteOne({
    _Id: ObjectId(req.params.id),
  });
  res.send(result);
};
