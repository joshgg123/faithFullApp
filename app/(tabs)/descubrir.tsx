import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

import {router} from "expo-router";
import ArticleCarousel2 from "@/components/globales/carousel/ArticlesCarousel2";
import { TalentsOnboarding } from "@/components/talentos/TalentsOnboarding";
import useTalents from "@/hooks/useTalents";
import { AppText as Text } from "@/components/ui/AppText";

export default function DescubrirScreen() {
  const { loading, profile, carousels, saveInterests } = useTalents();

  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!profile.onboardingCompleted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TalentsOnboarding onComplete={saveInterests} />
      </SafeAreaView>
    );
  }

  // 🔥 APLANAMOS TODOS LOS ARTÍCULOS Y FILTRAMOS DUPLICADOS DE RAÍZ
  const allArticles = useMemo(() => {
    const articles = carousels.flatMap((c) => c.articles);
    
    // Eliminamos artículos con IDs duplicados entre carruseles para limpiar la búsqueda
    const uniqueArticlesMap = new Map();
    articles.forEach((article) => {
      if (article.id) {
        uniqueArticlesMap.set(article.id, article);
      }
    });
    
    return Array.from(uniqueArticlesMap.values());
  }, [carousels]);

  // 🔍 FILTRO GLOBAL OPTIMIZADO
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return allArticles
      .map((a) => {
        const title = a.title?.toLowerCase() ?? "";
        const content = a.description?.toLowerCase() ?? "";

        let score = 0;

        if (title.includes(q)) score += 2;
        if (content.includes(q)) score += 1;

        return { ...a, score };
      })
      .filter((a) => a.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query, allArticles]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 🔝 HEADER SEARCH */}
      <View
        style={{
          padding: 16,
          paddingBottom: 8,
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: "700" }}>
          Descubrir
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <TextInput
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setSearchMode(text.length > 0);
            }}
            placeholder="Buscar artículos..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 14,
              padding: 12,
            }}
          />

          {searchMode && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setSearchMode(false);
              }}
              style={{
                justifyContent: "center",
                paddingHorizontal: 12,
              }}
            >
              <Text style={{ color: "#7C3AED", fontWeight: "600" }}>
                Limpiar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 📊 SEARCH MODE */}
      {searchMode ? (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {results.map((item, index) => (
            <TouchableOpacity
              // 👑 Hacemos el contenedor interactivo
              key={`${item.id}-${index}`}
              activeOpacity={0.7}
              onPress={() => {
                // Navega al detalle del artículo usando su ID
                // Nota: Ajusta la ruta si en tu proyecto se llama diferente (ej: "/(tabs)/descubrir/[id]")
                router.push({
                  pathname: "/(tabs)/talentos/[articleId]", 
                  params: { articleId: item.id }
                });
              }}
              style={{
                padding: 14,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 16,
                marginBottom: 10,
                backgroundColor: "#FFF", // Añadido para que se note el tap
              }}
            >
              <Text style={{ fontWeight: "600", fontSize: 16, color: "#1F2937" }}>
                {item.title}
              </Text>

              <Text style={{ color: "#6B7280", marginTop: 4 }}>
                {item.description?.slice(0, 80)}...
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Si no hay resultados, mostramos un aviso limpio */}
          {results.length === 0 && (
            <View style={{ alignItems: "center", marginTop: 32 }}>
              <Text style={{ color: "#9CA3AF" }}>No se encontraron artículos</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        // 🧠 FEED NORMAL
        <ScrollView showsVerticalScrollIndicator={false}>
          <ArticleCarousel2
            title="Recomendado para ti"
            articles={
              carousels.find((c) => c.id === "para-vos")?.articles ?? []
            }
          />

          <ArticleCarousel2
            title="Humanidades"
            articles={
              carousels.find((c) => c.id === "humanidades")?.articles ?? []
            }
          />

          <ArticleCarousel2
            title="Tecnología & Innovación"
            articles={
              carousels.find((c) => c.id === "tecnologia")?.articles ?? []
            }
          />

          <ArticleCarousel2
            title="Liderazgo"
            articles={
              carousels.find((c) => c.id === "liderazgo")?.articles ?? []
            }
          />

          <ArticleCarousel2
            title="Últimas novedades"
            articles={
              carousels.find((c) => c.id === "novedades")?.articles ?? []
            }
          />

          <ArticleCarousel2
            title="Historia & Cultura"
            articles={
              carousels.find((c) => c.id === "historia")?.articles ?? []
            }
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}