import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

export const getUsers = async (req, res) => {
  const users = await getCollection("users").find({}).toArray();
  res.send(users);
};

export const updateUser = async (req, res) => {
  const result = await getCollection("users").updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
};

export const deleteUser = async (req, res) => {
  const result = await getCollection("users").deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
};

export const updateSettings = async (req, res) => {
  const result = await getCollection("users").updateOne(
    { email: req.user.email },
    { $set: req.body }
  );
  res.send(result);
};
