import { ArticlesCarousel } from '@/components/globales/carousel/ArticlesCarousel';
import { bd } from '@/services/bd';

export default function SaludScreen() {
  return <ArticlesCarousel showcase={bd.carousels[0]} />;
}
