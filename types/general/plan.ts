export type PlanCategory = 'Ejercicio' | 'Alimentacion' | 'Espiritualidad';

export type ActivityPlan = {
  id: string;
  title: string;
  category: PlanCategory;
  completedDays: number;
  totalDays: number;
  bestScore: number;
  progress: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  imageUrl?: string;
};
