import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

export const getItems = async (req, res) => {
  const items = await getCollection("items").find({}).toArray();
  res.send(items);
};

export const getItem = async (req, res) => {
  const item = await getCollection("items").findOne({
    _id: ObjectId(req.params.id),
  });
  res.send(item);
};

export const createItem = async (req, res) => {
  const result = await getCollection("items").insertOne(req.body);
  res.send(result);
};

export const updateItem = async (req, res) => {
  const result = await getCollection("items").updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
};

export const deleteItem = async (req, res) => {
  const result = await getCollection("items").deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
};
