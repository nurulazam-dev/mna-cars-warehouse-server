const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getCollection } = require("../config/db");

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
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
