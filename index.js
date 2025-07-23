import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/item.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import wishlistRoutes from "./routes/wishlist.js";
import adminRoutes from "./routes/admin.js";

config();

const app = express();
const port = process.env.PORT || 5000;

const corsOption = {
  origin: true,
};

/* app.use(
  cors({
    origin: ["http://localhost:3000", "https://mna-cars-warehouse.web.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); */

// app.use(cors());

// Middleware
app.use(cors(corsOption));
app.use(json());

// Database connection
// connectDB();

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("MNA Car Warehouse - api running");
});

app.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});
