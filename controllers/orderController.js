import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

export const createOrder = async (req, res) => {
  const order = {
    ...req.body,
    createdAt: new Date(),
  };
  const result = await getCollection("orders").insertOne(order);
  res.send(result);
};

export const getOrders = async (req, res) => {
  const orders = await getCollection("orders").find({}).toArray();
  res.send(orders);
};

export const getOrdersByEmail = async (req, res) => {
  const orders = await getCollection("orders")
    .find({ email: req.params.email })
    .toArray();
  res.send(orders);
};

export const updateOrder = async (req, res) => {
  const result = await getCollection("orders").updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
};

export const deleteOrder = async (req, res) => {
  const result = await getCollection("orders").deleteOne({
    _id: ObjectId(req.params.id),
  });
  res.send(result);
};
