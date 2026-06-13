import { Router, Response } from "express";
import { MealLog } from "../models";
import { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/:date", async (req: AuthRequest, res: Response) => {
  try {
    const meals = await MealLog.find({ userId: req.userId, date: req.params.date }).sort({ createdAt: -1 });
    return res.json({ meals });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/:date", async (req: AuthRequest, res: Response) => {
  try {
    const meal = await MealLog.create({
      userId: req.userId,
      date: req.params.date,
      ...req.body,
    });
    return res.status(201).json({ meal });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await MealLog.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
