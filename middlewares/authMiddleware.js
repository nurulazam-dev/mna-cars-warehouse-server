import jwt from "jsonwebtoken";
import { getCollection } from "../config/db.js";
import { ObjectId } from "mongodb";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.userId = decoded.id || decoded._id || decoded.userId;

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.userId),
    });
    if (!user) return res.status(401).json({ message: "User not found." });
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Forbidden, admin only");
  }
  next();
};
