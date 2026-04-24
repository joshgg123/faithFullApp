import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';
import { Chip } from '@/components/general/Chip';
import type { Article } from '@/types/carousel/article';

type ArticleCardProps = {
  article: Article;
  accentStyle?: 'primary' | 'success' | 'accent';
};

export function ArticleCard({
  article,
  accentStyle = 'primary',
}: ArticleCardProps) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.category}>{article.category}</Text>
        <View
          style={[
            styles.readTimePill,
            accentStyle === 'primary' && styles.readTimePillPrimary,
            accentStyle === 'success' && styles.readTimePillSuccess,
            accentStyle === 'accent' && styles.readTimePillAccent,
          ]}>
          <Text style={styles.readTimeText}>{article.readTime}</Text>
        </View>
      </View>

      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.excerpt}>{article.excerpt}</Text>
      <Text style={styles.verse}>{article.verse}</Text>

      <View style={styles.tagsRow}>
        {article.tags.map((tag) => (
          <Chip key={tag.id} label={tag.label} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  category: {
    color: appColors.primary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  readTimePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readTimePillPrimary: {
    backgroundColor: appColors.primarySoft,
  },
  readTimePillSuccess: {
    backgroundColor: appColors.successSoft,
  },
  readTimePillAccent: {
    backgroundColor: appColors.accentSoft,
  },
  readTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: appColors.text,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    color: appColors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 15,
    lineHeight: 23,
    color: appColors.textSecondary,
    marginBottom: 12,
  },
  verse: {
    fontSize: 14,
    lineHeight: 22,
    color: appColors.text,
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
