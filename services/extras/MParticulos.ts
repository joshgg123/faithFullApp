// services/contentService.ts

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/services/firebaseService";
import { Article } from "@/types/content/article";

const contentCollection = collection(db, "CONTENT");

export async function getLatestArticles(
  amount: number = 5
): Promise<Article[]> {
  const q = query(
    contentCollection,
    orderBy("createdAt", "desc"),
    limit(amount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Article, "id">),
  }));
}