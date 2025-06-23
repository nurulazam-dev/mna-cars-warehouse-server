import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

/* export const createOrder = async (req, res) => {
  const order = {
    ...req.body,
    createdAt: new Date(),
  };
  const result = await getCollection("orders").insertOne(order);
  res.send(result);
}; */

export const createOrder = async (req, res) => {
  try {
    const ordersCollection = await getCollection("orders");

    const { email, items } = req.body;

    if (!email || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Email and at least one item are required." });
    }

    const order = {
      email,
      items: items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        price: item?.price,
        quantity: item?.quantity || 1,
        img: item?.img,
        brand: item?.brand,
        supplierEmail: item?.supplierEmail || "",
      })),
      status: "pending",
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);
    res
      .status(201)
      .json({
        message: "Order placed successfully.",
        orderId: result.insertedId,
      });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Server error while placing order." });
  }
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
