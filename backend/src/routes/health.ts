import { Router, Response } from "express";
import { HydrationLog, SleepLog, MealLog, Habit, HabitLog } from "../models";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/summary", async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [hydration, sleep, meals, habits, habitLogs] = await Promise.all([
      HydrationLog.findOne({ userId: req.userId, date: today }),
      SleepLog.findOne({ userId: req.userId, date: today }),
      MealLog.find({ userId: req.userId, date: today }).sort({ createdAt: -1 }),
      Habit.find({ userId: req.userId }),
      HabitLog.find({ userId: req.userId, date: today }),
    ]);

    const todayHabitLogs: Record<string, string> = {};
    habitLogs.forEach((l) => { todayHabitLogs[l.habitId] = l.status; });

    return res.json({
      hydration: hydration || { total_ml: 0, entries: [] },
      sleep: sleep || null,
      meals,
      habits,
      todayHabitLogs,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/weekly-hydration", async (req: AuthRequest, res: Response) => {
  try {
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }

    const logs = await HydrationLog.find({
      userId: req.userId,
      date: { $in: dates },
    });

    const data: Record<string, number> = {};
    dates.forEach((date) => { data[date] = 0; });
    logs.forEach((l) => { data[l.date] = l.total_ml; });

    return res.json({ data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/streak", async (req: AuthRequest, res: Response) => {
  try {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const [hydration, habitLogs] = await Promise.all([
        HydrationLog.findOne({ userId: req.userId, date: dateStr }),
        HabitLog.find({ userId: req.userId, date: dateStr }),
      ]);

      const hasHydration = (hydration?.total_ml || 0) > 0;
      const hasHabits = habitLogs.some((l) => l.status === "completed");

      if (hasHydration || hasHabits) {
        streak++;
      } else {
        break;
      }
    }
    return res.json({ streak });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
