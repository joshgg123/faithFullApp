import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/services/firebaseService";

import { Cashbox } from "@/types/tesoros/cashbox";

import { Transaction } from "@/types/tesoros/transaction";

/*
 * TODO:
 * reemplazar por auth.currentUser.uid
 */
const USER_ID = "DsKU3kJoDuWZywM8RdRo";

/* ==========================================
   COLLECTIONS
========================================== */

const cashboxesCollection =
  collection(
    db,
    "USUARIO",
    USER_ID,
    "cashboxes",
  );

const transactionsCollection =
  collection(
    db,
    "USUARIO",
    USER_ID,
    "Transactions",
  );

/* ==========================================
   CASHBOXES
========================================== */

export async function getActiveCashbox(): Promise<Cashbox | null> {
  const q = query(
    cashboxesCollection,
    where("status", "==", "open"),
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const document = snapshot.docs[0];

  return {
    id: document.id,

    ...(document.data() as Omit<
      Cashbox,
      "id"
    >),
  };
}

export async function getCashboxes(): Promise<
  Cashbox[]
> {
  const snapshot =
    await getDocs(
      cashboxesCollection,
    );

  return snapshot.docs.map(
    (document) => ({
      id: document.id,

      ...(document.data() as Omit<
        Cashbox,
        "id"
      >),
    }),
  );
}

export async function getCashbox(
  cashboxId: string,
): Promise<Cashbox | null> {
  const snapshot =
    await getDoc(
      doc(
        db,
        "USUARIO",
        USER_ID,
        "cashboxes",
        cashboxId,
      ),
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,

    ...(snapshot.data() as Omit<
      Cashbox,
      "id"
    >),
  };
}

export async function createCashbox(
  name: string,
): Promise<void> {
  await addDoc(
    cashboxesCollection,
    {
      name,

      status: "open",

      createdAt:
        new Date().toISOString(),

      closedAt: null,

      finalBalance: null,

      totalIncome: null,

      totalExpense: null,
    },
  );
}

export async function closeCashbox(
  cashboxId: string,
): Promise<void> {
  const cashboxRef = doc(
    db,
    "USUARIO",
    USER_ID,
    "cashboxes",
    cashboxId,
  );

  const snapshot = await getDoc(
    cashboxRef,
  );

  if (!snapshot.exists()) {
    throw new Error(
      "Caja no encontrada",
    );
  }

  /**
   * SOLO CONFIRMADAS
   */
  const transactions =
    await getTransactions(
      cashboxId,
    );

  const confirmedTransactions =
    transactions.filter(
      (transaction) =>
        transaction.status ===
        "confirmed",
    );

  const totalIncome =
    confirmedTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "income",
      )
      .reduce(
        (acc, transaction) =>
          acc +
          transaction.amount,
        0,
      );

  const totalExpense =
    confirmedTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense",
      )
      .reduce(
        (acc, transaction) =>
          acc +
          transaction.amount,
        0,
      );

  const finalBalance =
    totalIncome -
    totalExpense;

  await updateDoc(cashboxRef, {
    status: "closed",

    closedAt:
      new Date().toISOString(),

    finalBalance,

    totalIncome,

    totalExpense,
  });
}
export async function closeAndCreateCashbox(
  currentCashboxId: string,
  newCashboxName: string,
): Promise<void> {
  // cerrar actual
  await closeCashbox(
    currentCashboxId,
  );

  // crear nueva
  await createCashbox(
    newCashboxName,
  );
}
/* ==========================================
   TRANSACTIONS
========================================== */

export async function getTransactions(
  cashboxId: string,
): Promise<Transaction[]> {
  const q = query(
    transactionsCollection,
    where(
      "cashboxId",
      "==",
      cashboxId,
    ),
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (document) => ({
      id: document.id,

      ...(document.data() as Omit<
        Transaction,
        "id"
      >),
    }),
  );
}

export async function getTransaction(
  transactionId: string,
): Promise<Transaction | null> {
  const snapshot =
    await getDoc(
      doc(
        db,
        "USUARIO",
        USER_ID,
        "Transactions",
        transactionId,
      ),
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,

    ...(snapshot.data() as Omit<
      Transaction,
      "id"
    >),
  };
}

export async function createTransaction(
  cashboxId: string,
  data: Omit<Transaction, "id">,
): Promise<void> {
  const amount =
    Number(data.amount) || 0;

  await addDoc(
    transactionsCollection,
    {
      ...data,

      amount,

      cashboxId,

      createdAt:
        data.createdAt ||
        new Date().toISOString(),
    },
  );
}

export async function updateTransaction(
  transactionId: string,
  transaction: Partial<Transaction>,
): Promise<void> {
  await updateDoc(
    doc(
      db,
      "USUARIO",
      USER_ID,
      "Transactions",
      transactionId,
    ),
    transaction,
  );
}

export async function deleteTransaction(
  transactionId: string,
): Promise<void> {
  await deleteDoc(
    doc(
      db,
      "USUARIO",
      USER_ID,
      "Transactions",
      transactionId,
    ),
  );
}

export async function getPendingTransactions(): Promise<
  Transaction[]
> {
  const q = query(
    transactionsCollection,
    where("status", "==", "pending"),
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (document) => ({
      id: document.id,

      ...(document.data() as Omit<
        Transaction,
        "id"
      >),
    }),
  );
}