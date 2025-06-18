import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollection } from "../config/db.js";

export const register = async (req, res) => {
  const usersCollection = getCollection("users");
  const { email, password, name } = req.body;

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await usersCollection.insertOne({
    email,
    password: hashedPassword,
    name,
    role: "user",
  });

  res.send(result);
};

export const login = async (req, res) => {
  const usersCollection = getCollection("users");
  const { email, password } = req.body;

  const user = await usersCollection.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET_TOKEN,
    { expiresIn: "7d" }
  );

  res.send({
    token,
    user: { id: user._id, email: user.email, role: user.role, name: user.name },
  });
};

export const forgotPassword = async (req, res) => {
  const usersCollection = getCollection("users");
  const { email } = req.body;
  const user = await usersCollection.findOne({ email });

  if (!user)
    return res
      .status(200)
      .json({ message: "If user exists, an email will be sent." });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "1h",
  });

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  // Send email logic here (using nodemailer, etc.)

  res.status(200).json({ message: "Password reset link sent." });
};
