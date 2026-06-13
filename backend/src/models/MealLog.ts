import mongoose, { Schema, Document } from "mongoose";

export interface IMealLog extends Document {
  userId: string;
  date: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  createdAt: Date;
}

const MealLogSchema = new Schema<IMealLog>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  type: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
  name: { type: String, required: true },
  calories: { type: Number, default: 0 },
  protein_g: { type: Number, default: 0 },
  carbs_g: { type: Number, default: 0 },
  fat_g: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const MealLog = mongoose.model<IMealLog>("MealLog", MealLogSchema);
