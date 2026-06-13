import mongoose, { Schema, Document } from "mongoose";

export interface IHabit extends Document {
  userId: string;
  name: string;
  icon: string;
  color: string;
  frequency: string;
  reminder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  icon: { type: String, default: "checkmark-circle" },
  color: { type: String, default: "#7C6FF7" },
  frequency: { type: String, default: "daily" },
  reminder: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Habit = mongoose.model<IHabit>("Habit", HabitSchema);
