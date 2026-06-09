import express, { Request, Response } from "express";
import User from "../models/User";
import authMiddleware from "../middleware/auth";

const router = express.Router();

// POST /api/favorites/:movieId  — add favorite
router.post(
  "/:movieId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const movieId = parseInt(req.params.movieId, 10);
    if (isNaN(movieId))
      return res.status(400).json({ message: "Invalid movie ID" });

    try {
      const user = await User.findById(req.user?.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
        await user.save();
      }

      return res.status(200).json({ favorites: user.favorites });
    } catch (err) {
      console.error("Add favorite error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
);

// DELETE /api/favorites/:movieId  — remove favorite
router.delete(
  "/:movieId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const movieId = parseInt(req.params.movieId, 10);
    if (isNaN(movieId))
      return res.status(400).json({ message: "Invalid movie ID" });

    try {
      const user = await User.findById(req.user?.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.favorites = user.favorites.filter((id) => id !== movieId);
      await user.save();

      return res.status(200).json({ favorites: user.favorites });
    } catch (err) {
      console.error("Remove favorite error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
);

export default router;
