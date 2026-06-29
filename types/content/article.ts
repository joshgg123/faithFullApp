import { Timestamp } from "firebase/firestore";

export type ArticleType = "article" | "video";

export interface Article {
  id: string;

  title: string;

  description: string;

  type: ArticleType;

  image: string;

  videoUrl?: string;

  category: string;

  tags: string[];

  source: string;

  createdAt: Timestamp;

  content: string;
}