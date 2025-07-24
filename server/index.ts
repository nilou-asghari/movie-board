import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api/auth", authRoutes);
console.log("Auth routes loaded");
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/api/auth/register`);
  console.log(`Server running on port ${PORT}`);
});

app.get("/test", (req, res) => {
  res.send("Test route working");
});
