// ← Volver

// Imagen

// Título

// Categoría

// Tiempo de lectura

// Markdown

// Video (si existe)

// va ser la pantalla de articulo.
// 
// 
// y cuanddo el usuario haga click en un articulo, se va a abrir esta pantalla y se va a mostrar el contenido del articulo.

// getArticleById()

// ↓

// guardarArticuloLeido()

// ↓

// mostrar markdown


// import { useLocalSearchParams } from "expo-router";
// import { SafeAreaView, Text } from "react-native";

// export default function ArticleDetailScreen() {
//   const { articleId } = useLocalSearchParams();

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Detalle del artículo</Text>

//       <Text>{articleId}</Text>
//     </SafeAreaView>
//   );
// }import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Markdown from "react-native-markdown-display";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    getArticleById,
    guardarArticuloLeido,
} from "@/services/talentosServices/talentos";

import { Article } from "@/types/talentos/article";

import { appColors } from "@/constants/colors";
import { useEffect, useState } from "react";

export default function ArticleDetailScreen() {

  const { articleId } =
    useLocalSearchParams<{
      articleId: string;
    }>();

  const [loading, setLoading] =
    useState(true);

  const [article, setArticle] =
    useState<Article | null>(null);

  useEffect(() => {
    loadArticle();
  }, []);

  async function loadArticle() {
    try {
      const data =
        await getArticleById(articleId);

      if (!data) return;

      setArticle(data);

      // Guarda automáticamente en "leidos"
      await guardarArticuloLeido(
        data.title
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
    console.log("PARAM:", articleId);
console.log("ARTICLE:", article);
console.log("MARKDOWN:", article?.markdownBody);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
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
  console.log("PARAM:", articleId);
console.log("ARTICLE:", article);
console.log("MARKDOWN:", article?.markdownBody);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>
          ← Volver
        </Text>
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

        <Text style={styles.category}>
          {article.category}
        </Text>

        <Text style={styles.title}>
          {article.title}
        </Text>

        {!!article.description && (
          <Text style={styles.description}>
            {article.description}
          </Text>
        )}

        <Markdown
          style={{
            body: {
              color: appColors.text,
              fontSize: 17,
              lineHeight: 28,
            },

            heading1: {
              color: appColors.text,
              fontSize: 30,
              marginBottom: 16,
            },

            heading2: {
              color: appColors.text,
              fontSize: 24,
              marginTop: 24,
            },

            paragraph: {
              marginBottom: 14,
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