const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

exports.getItems = async (req, res) => {
  const items = await getCollection("items").find({}).toArray();
  res.send(items);
};

exports.getItem = async (req, res) => {
  const item = await getCollection("items").findOne({
    _id: ObjectId(req.params.id),
  });
  res.send(item);
};

exports.createItem = async (req, res) => {
  const result = await getCollection("items").insertOne(req.body);
  res.send(result);
};

exports.updateItem = async (req, res) => {
  const result = await getCollection("items").updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
};

exports.deleteItem = async (req, res) => {
  const result = await getCollection("items").deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
};
