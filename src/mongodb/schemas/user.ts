import mongoose, {Schema, Document} from "mongoose";

interface Preferences {
    theme?: string,
    language?: string,
}

export interface IUser extends Document {
    clerkId: string,
    email?: string,
    name?: string
    preferences: Preferences
    createdAt: Date
}

const UserSchema: Schema = new Schema(
    {
      clerkId: { type: String, required: true },
      email: { type: String },
      name: { type: String },
      preferences: {
        theme: { type: String, default: "light" },
        language: { type: String, default: "en" }
      }
    },
    { timestamps: true }
);




