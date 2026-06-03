export interface Cashbox {
  id: string;

  name: string;

  status: "open" | "closed";

  createdAt: number;

  closedAt: number | null;

  finalBalance: number | null;

  totalIncome: number;

  totalExpense: number;
}