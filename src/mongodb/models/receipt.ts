import mongoose, { Schema, Document } from "mongoose";

export interface IReceipt extends Document {
  userId: mongoose.Types.ObjectId;
  expenses: mongoose.Types.ObjectId[]; // Reference to Expense documents
  totalAmount: number;
  merchant: string;
  purchaseDate: Date;
  location?: string;
  receiptImageUrl: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReceiptSchema: Schema<IReceipt> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expense",
        required: true,
        validate: {
          validator: (expenses: mongoose.Types.ObjectId[]) =>
            expenses.length > 0,
          message: "At least one expense is required",
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0.01, "Total amount must be at least 0.01"],
    },
    merchant: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    purchaseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    receiptImageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (url: string) => {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url);
        },
        message: "Invalid receipt URL format",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for populated expenses
ReceiptSchema.virtual("expenseDetails", {
  ref: "Expense",
  localField: "expenses",
  foreignField: "_id",
  justOne: false,
});

// Validation to ensure total matches sum of expenses
ReceiptSchema.pre<IReceipt>("validate", async function (next) {
  if (this.isModified("expenses") || this.isModified("totalAmount")) {
    const expenses = await mongoose.models.Expense.find({
      _id: { $in: this.expenses },
    });

    const calculatedTotal = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    if (calculatedTotal !== this.totalAmount) {
      next(
        new Error(
          `Total amount ${this.totalAmount} doesn't match sum of expenses (${calculatedTotal})`
        )
      );
      return;
    }
  }
  next();
});

// Cascade delete expenses when receipt is removed
ReceiptSchema.pre<IReceipt>("deleteOne", async function (next) {
  await mongoose.models.Expense.deleteMany({ _id: { $in: this.expenses } });
  next();
});

// Indexes
ReceiptSchema.index({ userId: 1, purchaseDate: -1 });
ReceiptSchema.index({ merchant: "text", "expenseDetails.description": "text" });

export default mongoose.models.Receipt ||
  mongoose.model<IReceipt>("Receipt", ReceiptSchema);
