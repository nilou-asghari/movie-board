import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
