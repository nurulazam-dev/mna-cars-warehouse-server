const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
require("dotenv").config();

// import or declare routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// routes

app.get("/", (req, res) => {
  res.send("MNA Car Warehouse - api running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
