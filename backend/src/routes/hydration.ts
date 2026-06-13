import { Router, Response } from "express";
import { HydrationLog } from "../models";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/:date", async (req: AuthRequest, res: Response) => {
  try {
    const log = await HydrationLog.findOne({ userId: req.userId, date: req.params.date });
    return res.json({ log: log || { total_ml: 0, entries: [] } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/:date", async (req: AuthRequest, res: Response) => {
  try {
    const log = await HydrationLog.findOneAndUpdate(
      { userId: req.userId, date: req.params.date },
      { ...req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return res.json({ log });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/:date/add", async (req: AuthRequest, res: Response) => {
  try {
    const { ml } = req.body;
    const existing = await HydrationLog.findOne({ userId: req.userId, date: req.params.date });
    const entry = { ml, timestamp: new Date() };
    let log;
    if (existing) {
      existing.entries.push(entry);
      existing.total_ml += ml;
      existing.updatedAt = new Date();
      log = await existing.save();
    } else {
      log = await HydrationLog.create({
        userId: req.userId,
        date: req.params.date,
        total_ml: ml,
        entries: [entry],
      });
    }
    return res.json({ log });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
