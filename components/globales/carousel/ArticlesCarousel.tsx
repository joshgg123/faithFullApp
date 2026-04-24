import { Image } from 'expo-image';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';
import { ArticleCard } from '@/components/general/ArticleCard';
import type { ArticlesShowcase } from '@/types/carousel/article';

type ArticlesCarouselProps = {
  showcase: ArticlesShowcase;
};

export function ArticlesCarousel({ showcase }: ArticlesCarouselProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{showcase.eyebrow}</Text>
          </View>

          <Text style={styles.title}>{showcase.title}</Text>
          <Text style={styles.subtitle}>{showcase.subtitle}</Text>

          <View style={styles.featuredBox}>
            {showcase.featured.type === 'image' ? (
              <Image
                source={{ uri: showcase.featured.imageUrl }}
                accessibilityLabel={showcase.featured.imageAlt}
                contentFit="cover"
                style={styles.featuredImage}
              />
            ) : (
              <Text style={styles.featuredText}>{showcase.featured.text}</Text>
            )}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Articulos relacionados</Text>
          <Text style={styles.sectionSubtitle}>Explora hacia abajo todo el contenido.</Text>
        </View>

        <View style={styles.articlesList}>
          {showcase.articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              accentStyle={
                index % 3 === 0 ? 'primary' : index % 3 === 1 ? 'success' : 'accent'
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 18,
  },
  heroCard: {
    backgroundColor: appColors.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: appColors.border,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: appColors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 14,
  },
  badgeText: {
    color: appColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: appColors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: appColors.textSecondary,
    marginBottom: 18,
  },
  featuredBox: {
    minHeight: 220,
    borderRadius: 24,
    backgroundColor: appColors.featuredBackground,
    borderWidth: 1,
    borderColor: appColors.featuredBorder,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  featuredImage: {
    width: '100%',
    height: 220,
  },
  featuredText: {
    color: appColors.text,
    fontSize: 18,
    lineHeight: 28,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeader: {
    gap: 4,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  articlesList: {
    gap: 14,
  },
});
