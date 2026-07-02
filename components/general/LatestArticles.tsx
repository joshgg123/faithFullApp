import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AppText as Text } from "@/components/ui/AppText";
import { getLatestArticles } from "@/services/extras/MParticulos";
import { Article } from "@/types/content/article";

export function LatestArticles() {
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
      <Text style={styles.title}>Últimos artículos</Text>

      {loading ? (
        <ActivityIndicator color="#F5C518" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {
                // TODO: navegar al detalle
                console.log(article.id);
              }}
            >
              <Image
                source={{ uri: article.image }}
                style={styles.image}
              />

              <View style={styles.content}>
                <Text
                  style={styles.articleTitle}
                  numberOfLines={2}
                >
                  {article.title}
                </Text>

                <Text style={styles.category}>
                  {article.category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },

  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  card: {
    width: 190,
    backgroundColor: "#111",
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
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  category: {
    color: "#888",
    marginTop: 6,
    textTransform: "capitalize",
  },
});