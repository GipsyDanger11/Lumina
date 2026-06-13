import mongoose, { Schema, Document } from "mongoose";

export interface ISleepLog extends Document {
  userId: string;
  date: string;
  hours: number;
  quality: string;
  bedtime: string;
  wake_time: string;
  createdAt: Date;
  updatedAt: Date;
}

const SleepLogSchema = new Schema<ISleepLog>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  hours: { type: Number, default: 0 },
  quality: { type: String, default: "moderate" },
  bedtime: String,
  wake_time: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

SleepLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const SleepLog = mongoose.model<ISleepLog>("SleepLog", SleepLogSchema);
