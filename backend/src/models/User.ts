import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email?: string;
  passwordHash?: string;
  name: string;
  authProvider: "email" | "google" | "apple";
  googleId?: string;
  appleId?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, sparse: true, unique: true },
  passwordHash: String,
  name: { type: String, required: true },
  authProvider: { type: String, enum: ["email", "google", "apple"], default: "email" },
  googleId: { type: String, sparse: true },
  appleId: { type: String, sparse: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("User", UserSchema);
