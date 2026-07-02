// components/general/LatestArticles.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  if (loading) {
    return (
      <View style={styles.centerLoader}>
        <ActivityIndicator color="#F5C518" />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {articles.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => {
            // Navegación al detalle
            console.log(article.id);
          }}
        >
          <Image
            source={{ uri: article.image }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.content}>
            <Text style={styles.category}>{article.category}</Text>
            <Text style={styles.articleTitle} numberOfLines={2}>
              {article.title}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* TARJETA FINAL DE CONTINUIDAD (La flecha del sketch ">") */}
      <TouchableOpacity 
        style={styles.arrowCard} 
        activeOpacity={0.7}
        onPress={() => console.log("Ver más artículos")}
      >
        <Text style={styles.arrowText}>❯</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerLoader: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    paddingRight: 16,
    alignItems: "center",
  },
  card: {
    width: 140, // Más compacto y cuadrado para que entren más en pantalla
    height: 160,
    backgroundColor: "#111",
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  image: {
    width: "100%",
    height: 85,
  },
  content: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  category: {
    color: "#E8611A",
    fontSize: 8,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  articleTitle: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    marginTop: 2,
  },
  arrowCard: {
    width: 50,
    height: 160,
    backgroundColor: "#111",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  arrowText: {
    color: "#444",
    fontSize: 20,
    fontWeight: "bold",
  },
});