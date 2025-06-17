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
  try {
    const { _id, ...updateData } = req.body;

    const result = await getCollection("items").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Item updated successfully." });
    } else {
      res.status(400).json({ message: "No changes made or item not found." });
    }
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ message: "Error occurred while updating" });
  }
};

export const deleteItem = async (req, res) => {
  const result = await getCollection("items").deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
};
