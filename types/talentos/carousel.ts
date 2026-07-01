// import type { Article } from '@/types/carousel/article';
import { Article } from '@/types/talentos/article';

export type Carousel = {
  id: string;
  title: string;
  articles: Article[];
};