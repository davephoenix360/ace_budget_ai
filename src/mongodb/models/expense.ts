import mongoose, { Document, Schema } from "mongoose";

// Add this interface first
export enum ExpenseCategory {
  FOOD = "Food & Dining",
  TRANSPORT = "Transportation",
  ENTERTAINMENT = "Entertainment",
  GROCERIES = "Groceries",
  HEALTH = "Health & Wellness",
  UTILITIES = "Utilities & Bills",
  SHOPPING = "Shopping",
  EDUCATION = "Education",
  SUBSCRIPTIONS = "Subscriptions",
  TRAVEL = "Travel",
  INCOME = "Income",
  OTHER = "Other",
}

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: Date;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: Object.values(ExpenseCategory),
    },
    date: { type: Date, required: true },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

// Fix the model registration
const ExpenseModel =
  (mongoose.models && mongoose.models.Expense) || mongoose.model<IExpense>("Expense", ExpenseSchema);

  
export default ExpenseModel;
