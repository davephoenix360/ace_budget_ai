import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  totalBudget: number;
  startDate: Date;
  endDate: Date;
  categoryBudgets: {
    [category: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema<IBudget> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalBudget: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    categoryBudgets: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
