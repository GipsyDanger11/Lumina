import { Router, Response } from "express";
import { Habit } from "../models";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({ habits });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.create({ userId: req.userId, ...req.body });
    return res.status(201).json({ habit });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    return res.json({ habit });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
