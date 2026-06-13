import mongoose, { Schema, Document } from "mongoose";

export interface IHydrationLog extends Document {
  userId: string;
  date: string;
  total_ml: number;
  entries: { ml: number; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const HydrationLogSchema = new Schema<IHydrationLog>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  total_ml: { type: Number, default: 0 },
  entries: [{
    ml: Number,
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

HydrationLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const HydrationLog = mongoose.model<IHydrationLog>("HydrationLog", HydrationLogSchema);
