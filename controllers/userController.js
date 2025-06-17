import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getCollection } from "../config/db.js";

export const getUsers = async (req, res) => {
  const users = await getCollection("users").find({}).toArray();
  res.send(users);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const usersCollection = getCollection("users");

  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  if (!user) return res.status(404).json({ message: "User not found." });

  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
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

// updateSettings controller for update password
export const updateSettings = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  try {
    const usersCollection = getCollection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ message: "User not found." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: "Password updated successfully." });
    } else {
      res.status(500).json({ message: "Failed to update password." });
    }
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};
