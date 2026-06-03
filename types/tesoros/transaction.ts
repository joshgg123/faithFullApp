export type TransactionStatus =
  | "confirmed"
  | "pending";

export type TransactionType =
  | "income"
  | "expense";

export interface Transaction {
  id: string;

  cashboxId: string;

  description: string;

  amount: number;

  category: string;

  type: TransactionType;

  status: TransactionStatus;

  createdAt: string;

  scheduledFor?: string;
}