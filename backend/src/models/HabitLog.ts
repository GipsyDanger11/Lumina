import mongoose, { Schema, Document } from "mongoose";

export interface IHabitLog extends Document {
  userId: string;
  date: string;
  habitId: string;
  status: "enabled" | "completed" | "skipped";
  createdAt: Date;
}

const HabitLogSchema = new Schema<IHabitLog>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  habitId: { type: String, required: true },
  status: { type: String, enum: ["enabled", "completed", "skipped"], default: "enabled" },
  createdAt: { type: Date, default: Date.now },
});

HabitLogSchema.index({ userId: 1, date: 1, habitId: 1 }, { unique: true });

export const HabitLog = mongoose.model<IHabitLog>("HabitLog", HabitLogSchema);
