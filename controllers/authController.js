import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollection } from "../config/db.js";
import transporter from "../utils/email.js";

export const registerUser = async (req, res) => {
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
    createdAt: new Date(),
  });

  res.send(result);
};

export const login = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
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

  const resetLink = `${process.env.CLIENT_SITE_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: "noreply@yourdomain.com",
    to: email,
    subject: "Reset your password",
    html: `<p>Click here to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  });

  res.status(200).json({ message: "Reset email sent" });
};

export const resetPassword = async (req, res) => {
  const usersCollection = getCollection("users");
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Password reset successful" });
    } else {
      res.status(400).json({ message: "Failed to reset password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
