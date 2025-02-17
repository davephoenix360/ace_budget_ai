import mongoose, { Schema, Document } from "mongoose";

interface Preferences {
  theme?: string;
  language?: string;
}

export interface IUser extends Document {
  clerkId: string;
  email?: string;
  name?: string;
  preferences: Preferences;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    name: String,
    preferences: {
      theme: { type: String, default: "light" },
      language: { type: String, default: "en" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
