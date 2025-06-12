const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/db");

exports.getUsers = async (req, res) => {
  const users = await getCollection("users").find({}).toArray();
  res.send(users);
};

exports.updateUser = async (req, res) => {
  const result = await getCollection("users").updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
};

exports.deleteUser = async (req, res) => {
  const result = await getCollection("users").deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
};

exports.updateSettings = async (req, res) => {
  const result = await getCollection("users").updateOne(
    { email: req.user.email },
    { $set: req.body }
  );
  res.send(result);
};
