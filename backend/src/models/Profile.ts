import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: string;
  water_goal_ml: number;
  sleep_goal_hours: number;
  wake_time: string;
  bedtime: string;
  height: string;
  weight: string;
  gender: string;
  age: number;
  activity_level: string;
  goals: string[];
  onboarding_complete: boolean;
  notification_prefs: { hydration: boolean; sleep: boolean; habits: boolean; insights: boolean };
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: String, required: true, unique: true },
  water_goal_ml: { type: Number, default: 2500 },
  sleep_goal_hours: { type: Number, default: 8 },
  wake_time: { type: String, default: "7:00 AM" },
  bedtime: { type: String, default: "11:00 PM" },
  height: { type: String, default: "" },
  weight: { type: String, default: "" },
  gender: { type: String, default: "" },
  age: { type: Number, default: 0 },
  activity_level: { type: String, default: "moderate" },
  goals: [{ type: String }],
  onboarding_complete: { type: Boolean, default: false },
  notification_prefs: {
    type: new Schema({
      hydration: { type: Boolean, default: true },
      sleep: { type: Boolean, default: true },
      habits: { type: Boolean, default: true },
      insights: { type: Boolean, default: true },
    }, { _id: false }),
    default: { hydration: true, sleep: true, habits: true, insights: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
