import { appColors } from "@/constants/colors";
import { Article } from "@/types/talentos/article";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  title: string;
  articles: Article[];
};

export default function ArticleCarousel2({
  title,
  articles,
}: Props) {
  if (!articles?.length) return null;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {articles.length} artículos
        </Text>
      </View>

      {/* CAROUSEL */}
      <FlatList
        data={articles}
        keyExtractor={(item, index) =>
          item.id ?? `article-${index}`
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              if (!item.id) return;
              router.push(`/talentos/${item.id}`as any);
            }}
          >
            {/* IMAGE */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
              />

              {/* overlay suave */}
              <View style={styles.overlay} />
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
              <Text
                style={styles.articleTitle}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <Text
                style={styles.description}
                numberOfLines={2}
              >
                {item.description}
              </Text>

              <Text style={styles.readMore}>
                Leer artículo →
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },

  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: appColors.text,
  },

  subtitle: {
    fontSize: 12,
    color: appColors.textSecondary,
    marginTop: 2,
  },

  list: {
    paddingHorizontal: 16,
    gap: 14,
  },

  card: {
    width: 260,
    borderRadius: 20,
    backgroundColor: appColors.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: appColors.border,
  },

  imageContainer: {
    height: 140,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  content: {
    padding: 14,
  },

  articleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: appColors.text,
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: appColors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },

  readMore: {
    fontSize: 12,
    fontWeight: "600",
    color: appColors.primary,
  },
});