import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!req.userId || !items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "User not authenticated or items missing." });
    }

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.userId),
    });
    if (!user) return res.status(404).json({ message: "User not found." });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = items.map((item) => ({
      price_data: {
        currency: "bdt",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          images: item.img ? [item.img] : [],
        },
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_SITE_URL}/wishlist`,
      line_items,
      client_reference_id: req.userId,
    });

    const ordersCollection = await getCollection("orders");
    await ordersCollection.insertOne({
      email: user.email,
      userId: req.userId,
      items: items.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        img: item.img,
        brand: item.brand,
        supplierEmail: item.supplierEmail || "",
      })),
      status: "Pending",
      paymentSessionId: session.id,
      createdAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Checkout session created.",
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Stripe checkout session.",
    });
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
