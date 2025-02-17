import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  totalBudget: number;
  startDate: Date;
  endDate: Date;
  categoryBudgets: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema<IBudget> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    totalBudget: {
      type: Number,
      required: true,
      min: [0, "Total budget cannot be negative"],
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IBudget, value: Date) {
          return value < this.endDate;
        },
        message: "Start date must be before end date",
      },
    },
    endDate: {
      type: Date,
      required: true,
    },
    categoryBudgets: {
      type: Map,
      of: Number,
      default: new Map(),
      validate: {
        validator: function (map: Map<string, number>) {
          return Array.from(map.values()).every((v) => v >= 0);
        },
        message: "Category budgets cannot be negative",
      },
    },
  },
  { timestamps: true }
);

// Validation for date range
BudgetSchema.pre("validate", function (next) {
  if (this.startDate >= this.endDate) {
    next(new Error("End date must be after start date"));
  } else {
    next();
  }
});

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
