import type { ArticlesShowcase } from '@/types/carousel/article';
import type { ActivityPlan } from '@/types/general/plan';
import type { ProgressMetric } from '@/types/general/progress';

export type CarouselCollection = {
  carousels: ArticlesShowcase[];
  activityPlans: ActivityPlan[];
  progressMetrics: ProgressMetric[];
};
