import { Router, Response } from "express";
import { HabitLog } from "../models";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/:date", async (req: AuthRequest, res: Response) => {
  try {
    const logs = await HabitLog.find({ userId: req.userId, date: req.params.date });
    const map: Record<string, string> = {};
    logs.forEach((l) => { map[l.habitId] = l.status; });
    return res.json({ logs: map });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/:date/:habitId", async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const log = await HabitLog.findOneAndUpdate(
      { userId: req.userId, date: req.params.date, habitId: req.params.habitId },
      { status },
      { upsert: true, new: true }
    );
    return res.json({ log });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
