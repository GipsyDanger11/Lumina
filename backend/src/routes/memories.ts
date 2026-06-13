import { Router, Response } from "express";
import { Memory } from "../models";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const memory = await Memory.findOne({ userId: req.userId });
    return res.json({ items: memory?.items || [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body;
    if (!items?.length) return res.json({ items: [] });

    const memory = await Memory.findOneAndUpdate(
      { userId: req.userId },
      { items, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return res.json({ items: memory.items });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
