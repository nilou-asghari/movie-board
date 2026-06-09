import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import favoritesRouter from "./routes/favorites";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/favorites", favoritesRouter);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () =>
      console.log(` Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
