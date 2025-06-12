const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `${process.env.LOCAL_DATABASE}`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// JWT middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = decoded;
    next();
  });
}

async function run() {
  try {
    await client.connect();
    const db = client.db("carsWarehouse");
    const itemsCollection = db.collection("items");
    const usersCollection = db.collection("users");
    const ordersCollection = db.collection("orders");
    const wishlistCollection = db.collection("wishlists");

    /* ===============================
              Items Management
    ==================================*/
    app.get("/items", verifyToken, async (req, res) => {
      const items = await itemsCollection.find({}).toArray();
      res.send(items);
    });

    app.get("/items/:id", verifyToken, async (req, res) => {
      const item = await itemsCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.send(item);
    });

    app.post("/items", verifyToken, async (req, res) => {
      const result = await itemsCollection.insertOne(req.body);
      res.send(result);
    });

    app.delete("/items/:id", verifyToken, async (req, res) => {
      const result = await itemsCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/items/:id", verifyToken, async (req, res) => {
      const update = { $set: req.body };
      const result = await itemsCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        update
      );
      res.send(result);
    });

    /* ===============================
                  Auth
    ==================================*/
    app.post("/register", async (req, res) => {
      const { email, password, name } = req.body;
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) return res.status(400).send("User already exists");
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await usersCollection.insertOne({
        email,
        password: hashedPassword,
        name,
        role: "user",
      });
      res.send(result);
    });

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await usersCollection.findOne({ email });
      if (!user) return res.status(400).send("Invalid credentials");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send("Invalid credentials");

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "7d" }
      );
      res.send({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });
    });

    /* ===============================
              User Management
    ==================================*/
    app.get("/users", verifyToken, async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.send(users);
    });

    app.put("/users/:id", verifyToken, async (req, res) => {
      const update = { $set: req.body };
      const result = await usersCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        update
      );
      res.send(result);
    });

    app.delete("/users/:id", verifyToken, async (req, res) => {
      const result = await usersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //============== My Items (user uploaded items) =========//
    app.get("/myItems/:email", verifyToken, async (req, res) => {
      const items = await itemsCollection
        .find({ sellerEmail: req.params.email })
        .toArray();
      res.send(items);
    });

    //============== Wishlist ==============//
    app.post("/wishlist", verifyToken, async (req, res) => {
      const result = await wishlistCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/wishlist/:email", verifyToken, async (req, res) => {
      const wishlists = await wishlistCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(wishlists);
    });

    app.delete("/wishlist/:id", verifyToken, async (req, res) => {
      const result = await wishlistCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //============== Orders ==============//
    app.post("/orders", verifyToken, async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/orders", verifyToken, async (req, res) => {
      const orders = await ordersCollection.find({}).toArray();
      res.send(orders);
    });

    app.get("/orders/:email", verifyToken, async (req, res) => {
      const orders = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(orders);
    });

    app.put("/orders/:id", verifyToken, async (req, res) => {
      const update = { $set: req.body };
      const result = await ordersCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        update
      );
      res.send(result);
    });

    app.delete("/orders/:id", verifyToken, async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //============== Settings (update current user) ==============//
    app.put("/settings", verifyToken, async (req, res) => {
      const update = { $set: req.body };
      const result = await usersCollection.updateOne(
        { email: req.user.email },
        update
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("MNA CARS WAREHOUSE - API RUNNING");
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
