import mongoose, { Schema, Document } from "mongoose";

export interface IMemory extends Document {
  userId: string;
  items: string[];
  updatedAt: Date;
}

const MemorySchema = new Schema<IMemory>({
  userId: { type: String, required: true, unique: true },
  items: [{ type: String }],
  updatedAt: { type: Date, default: Date.now },
});

export const Memory = mongoose.model<IMemory>("Memory", MemorySchema);
