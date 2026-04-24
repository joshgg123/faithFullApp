import type { CarouselCollection } from '@/types/carousel/bd';

export const bd: CarouselCollection = {
  carousels: [
    {
      id: 'alabanzas',
      eyebrow: 'Biblia y alabanza',
      title: 'Que dice la Biblia de las alabanzas?',
      subtitle:
        'Este bloque principal puede mostrar una explicacion breve o una imagen destacada del articulo principal.',
      featured: {
        type: 'text',
        text: 'Aqui puede ir una explicacion corta del tema principal. Si prefieres una foto, solo cambia el tipo a "image" y envia la URL o la ruta del recurso que quieras mostrar.',
      },
      articles: [
        {
          id: 'praise',
          title: 'La alabanza como respuesta',
          excerpt:
            'La Biblia presenta la alabanza como una expresion de gratitud y reconocimiento del caracter de Dios.',
          verse: '"Todo lo que respira alabe a JAH. Aleluya." Salmos 150:6',
          category: 'Fundamentos',
          readTime: '4 min',
          tags: [
            { id: 'gratitud', label: 'Gratitud' },
            { id: 'gozo', label: 'Gozo' },
          ],
        },
        {
          id: 'worship',
          title: 'Adorar mas alla del canto',
          excerpt:
            'Adorar no se limita a la musica. Tambien involucra obediencia, reverencia y una vida rendida.',
          verse:
            '"Dios es Espiritu; y los que le adoran, en espiritu y en verdad es necesario que adoren." Juan 4:24',
          category: 'Adoracion',
          readTime: '6 min',
          tags: [
            { id: 'verdad', label: 'Verdad' },
            { id: 'entrega', label: 'Entrega' },
          ],
        },
        {
          id: 'heart',
          title: 'La actitud correcta del corazon',
          excerpt:
            'El valor de la alabanza no solo esta en su forma, sino en la sinceridad con la que nace.',
          verse:
            '"Ofrece a Dios sacrificio de alabanza, y paga tus votos al Altisimo." Salmos 50:14',
          category: 'Corazon',
          readTime: '5 min',
          tags: [
            { id: 'fe', label: 'Fe' },
            { id: 'humildad', label: 'Humildad' },
          ],
        },
      ],
    },
    {
      id: 'adoracion',
      eyebrow: 'Vida espiritual',
      title: 'Como vivir una adoracion cotidiana?',
      subtitle:
        'Otro carrusel independiente para probar que la pantalla puede alimentarse desde una pseudo BD con varios bloques.',
      featured: {
        type: 'text',
        text: 'Puedes reutilizar exactamente los mismos componentes con otro objeto y otro conjunto de articulos.',
      },
      articles: [
        {
          id: 'daily',
          title: 'Una vida que alaba cada dia',
          excerpt:
            'La alabanza puede salir del templo y convertirse en una practica diaria de memoria, gratitud y esperanza.',
          verse:
            '"Bendecire a Jehova en todo tiempo; su alabanza estara de continuo en mi boca." Salmos 34:1',
          category: 'Vida diaria',
          readTime: '4 min',
          tags: [
            { id: 'habito', label: 'Habito' },
            { id: 'esperanza', label: 'Esperanza' },
          ],
        },
        {
          id: 'community',
          title: 'Alabanza en comunidad',
          excerpt:
            'La alabanza tambien edifica a otros cuando se vive como una practica compartida y no solo individual.',
          verse:
            '"Hablando entre vosotros con salmos, con himnos y canticos espirituales." Efesios 5:19',
          category: 'Iglesia',
          readTime: '3 min',
          tags: [
            { id: 'unidad', label: 'Unidad' },
            { id: 'iglesia', label: 'Iglesia' },
          ],
        },
        {
          id: 'instruments',
          title: 'Instrumentos en la alabanza biblica',
          excerpt:
            'Salmos y cronicas muestran instrumentos como parte de celebraciones, orden y expresion comunitaria.',
          verse:
            '"Alabadle con pandero y danza; alabadle con cuerdas y flautas." Salmos 150:4',
          category: 'Musica',
          readTime: '7 min',
          tags: [
            { id: 'arpa', label: 'Arpa' },
            { id: 'pandero', label: 'Pandero' },
          ],
        },
      ],
    },
  ],
  activityPlans: [
    {
      id: 'abdominales-intermedio',
      title: 'Abdominales Intermedio',
      category: 'Ejercicio',
      completedDays: 5,
      totalDays: 15,
      bestScore: 88,
      progress: 44,
      difficulty: 3,
    },
    {
      id: 'ayuno-daniel',
      title: 'Ayuno de Daniel',
      category: 'Alimentacion',
      completedDays: 3,
      totalDays: 30,
      bestScore: 14,
      progress: 44,
      difficulty: 4,
    },
    {
      id: 'biblia-en-un-año',
      title: 'La Biblia en 1 año',
      category: 'Espiritualidad',
      completedDays: 212,
      totalDays: 365,
      bestScore: 100,
      progress: 44,
      difficulty: 5,
    },
  ],
  progressMetrics: [
    {
      id: 'survey-onboarding',
      title: 'Encuesta de intereses',
      subtitle: 'Esto sirve para el onboarding de talentos y personalizacion del feed.',
      current: 2,
      total: 5,
      unitLabel: 'preguntas',
      helperText: 'Faltan 3 preguntas para completar la encuesta.',
      icon: 'sparkles',
      variant: 'accent',
    },
    {
      id: 'plan-templo',
      title: 'Plan fuerza inicial',
      subtitle: 'Pensado para retos del modulo Templo con progreso por dias.',
      current: 12,
      total: 21,
      unitLabel: 'dias',
      helperText: 'Vas muy bien: ya superaste la mitad del plan.',
      icon: 'barbell',
      variant: 'success',
    },
  ],
};
