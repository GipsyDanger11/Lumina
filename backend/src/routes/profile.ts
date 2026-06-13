import { Router, Response } from "express";
import { Profile } from "../models";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) return res.json({ profile: null });
    return res.json({ profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/", async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return res.json({ profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
