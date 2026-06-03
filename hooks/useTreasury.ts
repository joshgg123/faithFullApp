import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  closeCashbox as closeCashboxService,
  createCashbox as createCashboxService,
  createTransaction as createTransactionService,
  getActiveCashbox,
  getTransactions,
} from "@/services/tesorosServices/tesoros";

import { Cashbox } from "@/types/tesoros/cashbox";

import { Transaction } from "@/types/tesoros/transaction";

export default function useTreasury() {
  const [loading, setLoading] =
    useState(true);

  const [cashbox, setCashbox] =
    useState<Cashbox | null>(null);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  async function loadData() {
    try {
      setLoading(true);

      const activeCashbox =
        await getActiveCashbox();

      setCashbox(activeCashbox);

      if (!activeCashbox) {
        setTransactions([]);

        return;
      }

      const transactionsData =
        await getTransactions(
          activeCashbox.id,
        );

      const sorted =
        transactionsData.sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );

      setTransactions(sorted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const confirmedTransactions =
    useMemo(() => {
      return transactions.filter(
        (transaction) =>
          transaction.status ===
          "confirmed",
      );
    }, [transactions]);

  const balance = useMemo(() => {
    return confirmedTransactions.reduce(
      (acc, transaction) => {
        if (
          transaction.type ===
          "income"
        ) {
          return (
            acc + transaction.amount
          );
        }

        return (
          acc - transaction.amount
        );
      },
      0,
    );
  }, [confirmedTransactions]);

  const totalIncome =
    useMemo(() => {
      return confirmedTransactions
        .filter(
          (t) =>
            t.type === "income",
        )
        .reduce(
          (acc, t) =>
            acc + t.amount,
          0,
        );
    }, [confirmedTransactions]);

  const totalExpense =
    useMemo(() => {
      return confirmedTransactions
        .filter(
          (t) =>
            t.type === "expense",
        )
        .reduce(
          (acc, t) =>
            acc + t.amount,
          0,
        );
    }, [confirmedTransactions]);

  async function createTransaction(
    transaction: Omit<
      Transaction,
      "id"
    >,
  ) {
    if (!cashbox) return;

    await createTransactionService(
      cashbox.id,
      transaction,
    );

    await loadData();
  }

  async function closeCashbox() {
    if (!cashbox) return;

    await closeCashboxService(
      cashbox.id,
    );

    await loadData();
  }

  async function createCashbox(
    name: string,
  ) {
    await createCashboxService(
      name,
    );

    await loadData();
  }

  return {
    loading,

    cashbox,

    transactions,

    confirmedTransactions,

    balance,

    totalIncome,

    totalExpense,

    reload: loadData,

    createTransaction,

    closeCashbox,

    createCashbox,
  };
}