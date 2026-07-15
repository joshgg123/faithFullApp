import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { getLatestArticles } from "@/services/extras/MParticulos";
import { Article } from "@/types/content/article";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export function LatestArticles() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      setLoading(true);
      const data = await getLatestArticles(5);
      setArticles(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleRow}
        activeOpacity={0.7}
        onPress={() => router.push("/descubrir")}
      >
        <Text style={styles.title}>Últimos artículos</Text>
        <Ionicons name="chevron-forward" size={18} color={theme.primary} />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/talentos/[articleId]",
                  params: { articleId: article.id, from: "home" },
                } as any);
              }}
            >
              <Image source={{ uri: article.image }} style={styles.image} />

              <View style={styles.content}>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                <Text style={styles.category}>{article.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: 25,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 15,
    },
    title: {
      color: theme.textSecondary,
      fontSize: 22,
      fontWeight: "700",
    },
    card: {
      width: 190,
      backgroundColor: theme.surfaceAlt,
      borderRadius: 18,
      overflow: "hidden",
      marginRight: 15,
    },
    image: {
      width: "100%",
      height: 120,
    },
    content: {
      padding: 12,
    },
    articleTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "700",
    },
    category: {
      color: theme.textSecondary,
      marginTop: 6,
      textTransform: "capitalize",
    },
  });