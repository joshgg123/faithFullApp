import ArticleCarousel2 from "@/components/globales/carousel/ArticlesCarousel2";
import { TalentsOnboarding } from "@/components/talentos/TalentsOnboarding";
import useTalents from "@/hooks/useTalents";
import { ActivityIndicator, SafeAreaView, ScrollView, View, Button } from "react-native";


export default function DescubrirScreen() {
  const {
    loading,
    profile,
    carousels,
    saveInterests,
  } = useTalents();

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // 🧠 ONBOARDING (solo primera vez)
  if (!profile.onboardingCompleted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TalentsOnboarding onComplete={saveInterests} />
      </SafeAreaView>
    );
  }

  return (
    // Boton para seedear articulos
   



    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        

        {/* 🔥 RECOMENDADO PARA TI */}
        <ArticleCarousel2
          title="Recomendado para ti"
          articles={
            carousels.find(c => c.id === "para-vos")?.articles ?? []
          }
        />

        {/* 🧠 HUMANIDADES */}
        <ArticleCarousel2
          title="Humanidades"
          articles={
            carousels.find(c => c.id === "humanidades")?.articles ?? []
          }
        />

        {/* 🚀 TECNOLOGÍA */}
        <ArticleCarousel2
          title="Tecnología & Innovación"
          articles={
            carousels.find(c => c.id === "tecnologia")?.articles ?? []
          }
        />

        {/* 🌍 LIDERAZGO */}
        <ArticleCarousel2
          title="Liderazgo"
          articles={
            carousels.find(c => c.id === "liderazgo")?.articles ?? []
          }
        />

        {/* 📰 NOVEDADES */}
        <ArticleCarousel2
          title="Últimas novedades"
          articles={
            carousels.find(c => c.id === "novedades")?.articles ?? []
          }
        />

        {/* 📚 HISTORIA / GENERAL */}
        <ArticleCarousel2
          title="Historia & Cultura"
          articles={
            carousels.find(c => c.id === "historia")?.articles ?? []
          }
        />

      </ScrollView>
    </SafeAreaView>
  );
}