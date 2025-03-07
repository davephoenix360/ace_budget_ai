type IExpense = {
  id: string;
  userId: string;
  receiptId: string;
  amount: number;
  description: string;
  category: string;
  date: { nanoseconds: number; seconds: number };
  receiptUrl?: string;
  createdAt: { nanoseconds: number; seconds: number };
  updatedAt: { nanoseconds: number; seconds: number };
};

export type { IExpense };
