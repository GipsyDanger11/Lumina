import { Router, Response } from "express";
import { SleepLog } from "../models";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/:date", async (req: AuthRequest, res: Response) => {
  try {
    const log = await SleepLog.findOne({ userId: req.userId, date: req.params.date });
    return res.json({ log: log || null });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/:date", async (req: AuthRequest, res: Response) => {
  try {
    const log = await SleepLog.findOneAndUpdate(
      { userId: req.userId, date: req.params.date },
      { ...req.body, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return res.json({ log });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
