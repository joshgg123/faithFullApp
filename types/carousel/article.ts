export type ArticleTag = {
  id: string;
  label: string;
};

export type FeaturedContent =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image';
      imageUrl: string;
      imageAlt: string;
    };

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  verse: string;
  category: string;
  readTime: string;
  tags: ArticleTag[];
};

export type ArticlesShowcase = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  featured: FeaturedContent;
  articles: Article[];
};
