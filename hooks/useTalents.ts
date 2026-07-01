import {
  getArticles,
  getUserTalentProfile,
  saveUserInterests,
} from "@/services/talentosServices/talentos";

import { Article } from "@/types/talentos/article";
import { Carousel } from "@/types/talentos/carousel";
import { useEffect, useMemo, useState } from "react";

export default function useTalents() {
  const [loading, setLoading] = useState(true);

  const [articles, setArticles] = useState<Article[]>([]);

  const [profile, setProfile] = useState<{
    interests: string[];
    onboardingCompleted: boolean;
    leidos: string[];
  }>({
    interests: [],
    onboardingCompleted: false,
    leidos: [],
  });

  // 🔄 LOAD DATA
  async function loadData() {
    try {
      setLoading(true);

      const [allArticles, userProfile] = await Promise.all([
        getArticles(),
        getUserTalentProfile(),
      ]);

      setArticles(allArticles);
      setProfile(userProfile);
    } catch (error) {
      console.log("ERROR useTalents:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // 📦 CAROUSELES DERIVADOS
  const carousels = useMemo<Carousel[]>(() => {
    if (!articles.length) return [];

    // 🎯 PERSONALIZADOS POR INTERESES
    const personalized = articles.filter((article) =>
      article.tags?.some((tag) =>
        profile.interests.includes(tag)
      )
    );

    // 🆕 NOVEDADES (últimos artículos)
    const novedades = [...articles]
      .sort((a, b) => {
        const timeA =
          a.createdAt?.toMillis?.() ??
          new Date(a.createdAt as any).getTime();

        const timeB =
          b.createdAt?.toMillis?.() ??
          new Date(b.createdAt as any).getTime();

        return timeB - timeA;
      })
      .slice(0, 6);

    // 🧠 CATEGORÍAS BÁSICAS
    const byCategory = (cat: string) =>
      articles.filter((a) => a.category === cat);

    return [
      {
        id: "para-vos",
        title: "Para vos",
        articles: personalized,
      },
      {
        id: "novedades",
        title: "Novedades",
        articles: novedades,
      },
      {
        id: "tecnologia",
        title: "Tecnología",
        articles: byCategory("tecnologia"),
      },
      {
        id: "humanidades",
        title: "Humanidades",
        articles: byCategory("humanidades"),
      },
      {
        id: "liderazgo",
        title: "Liderazgo",
        articles: byCategory("liderazgo"),
      },
    ].filter((c) => c.articles.length > 0);
  }, [articles, profile.interests]);

  // 💾 GUARDAR INTERESES
  async function saveInterests(next: string[]) {
    await saveUserInterests(next);
    await loadData();
  }

  return {
    loading,
    articles,
    profile,
    carousels,
    reload: loadData,
    saveInterests,
  };
}