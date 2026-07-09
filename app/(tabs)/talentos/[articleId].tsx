import { AppText as Text } from "@/components/ui/AppText";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

import { useAchievementCheck } from "@/hooks/useAchievementCheck"; // Hook importado correctamente

import {
  getArticleById,
  guardarArticuloLeido,
} from "@/services/talentosServices/talentos";

import { appColors } from "@/constants/colors";
import { Article } from "@/types/talentos/article";

export default function ArticleDetailScreen() {
  const { articleId, from } = useLocalSearchParams<{
    articleId: string;
    from?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);

  // 🔥 SOLUCIÓN: El hook se inicializa ACÁ arriba, siguiendo las reglas de React
  const { checkAchievements } = useAchievementCheck();

  useEffect(() => {
    loadArticle();
  }, []);

  async function loadArticle() {
    try {
      const data = await getArticleById(articleId);

      if (!data) return;

      setArticle(data);

      // 1. Esperamos que termine de guardarse el artículo en Firestore
      await guardarArticuloLeido(data.title);
      
      // 2. 🔥 Lanzamos la comprobación de logros de lectura de manera limpia
      await checkAchievements("articles_read");
      
    } catch (error) {
      console.log("Error al cargar artículo o verificar logros:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.loading}>
        <Text>No se encontró el artículo.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (from === "home") {
            router.replace("/(tabs)");
          } else {
            router.replace("/(tabs)/descubrir");
          }
        }}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      {!!article.image && (
        <Image
          source={{
            uri: article.image,
          }}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        <Text style={styles.category}>{article.category}</Text>

        <Text style={styles.title}>{article.title}</Text>

        {!!article.description && (
          <Text style={styles.description}>{article.description}</Text>
        )}

        <Markdown
          style={{
            body: {
              color: appColors.text,
              fontSize: 17,
              lineHeight: 28,
              fontFamily: "Satoshi-Regular",
            },
            heading1: {
              color: appColors.text,
              fontSize: 30,
              marginBottom: 16,
              fontFamily: "Satoshi-Regular",
            },
            heading2: {
              color: appColors.text,
              fontSize: 24,
              marginTop: 24,
              fontFamily: "Satoshi-Regular",
            },
            paragraph: {
              marginBottom: 14,
              fontFamily: "Satoshi-Regular",
            },
            strong: {
              fontFamily: "Satoshi-Regular",
              fontWeight: "700",
            },
            em: {
              fontFamily: "Satoshi-Regular",
              fontStyle: "italic",
            },
            list_item: {
              fontFamily: "Satoshi-Regular",
              marginBottom: 8,
            },
            link: {
              color: appColors.primary,
              textDecorationLine: "underline",
              fontFamily: "Satoshi-Regular",
            },
            image: {
              borderRadius: 12,
            },
          }}
        >
          {article.markdownBody}
        </Markdown>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    padding: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: appColors.primary,
  },
  image: {
    width: "100%",
    height: 240,
  },
  content: {
    padding: 20,
  },
  category: {
    color: appColors.primary,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: appColors.text,
    marginBottom: 14,
  },
  description: {
    color: appColors.textSecondary,
    fontSize: 17,
    marginBottom: 24,
  },
});