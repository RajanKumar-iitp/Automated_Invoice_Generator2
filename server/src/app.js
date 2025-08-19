import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/invoices";

app.get("/", (req, res) => res.json({ ok: true, msg: "Invoice API" }));
app.use("/api/invoices", invoiceRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
