import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import authMiddleware from "./middlewares/authMiddlewares.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// Middlewares

app.use(cors());
app.use(express.json());


// MongoDB's  Connection

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is Connected ✅");
  } catch (err) {
    console.log("Error while connecting to the database :", err.message);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
// Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening at port number: ${PORT}`);
});

app.get("/api/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route",
    user: req.user,
  });
});
