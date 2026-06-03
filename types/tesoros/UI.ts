import { Cashbox } from "./cashbox";
import { Transaction } from "./transaction";

export interface CashboxDetail {
  cashbox: Cashbox;

  transactions: Transaction[];
}