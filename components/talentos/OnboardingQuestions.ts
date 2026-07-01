export interface OnboardingOption {
  label: string;
  tags: string[];
}

export interface OnboardingQuestion {
  id: number;
  question: string;
  options: OnboardingOption[];
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 1,
    question: "¿Qué orientación estudias o te interesa más?",
    options: [
      {
        label: "Humanidades",
        tags: ["humanidades", "filosofia", "historia"],
      },
      {
        label: "Ingenierías / IT",
        tags: ["tecnologia", "futuro", "novedades"],
      },
      {
        label: "Administración / Negocios",
        tags: ["liderazgo", "comunicacion"],
      },
      {
        label: "Ciencias Sociales",
        tags: ["servicio", "comunidad"],
      },
    ],
  },

  {
    id: 2,
    question: "¿Qué tipo de actividades disfrutas más en tu tiempo libre?",
    options: [
      {
        label: "Tocar instrumentos musicales",
        tags: ["musica", "arte"],
      },
      {
        label: "Leer y estudiar",
        tags: ["teologia", "estudio", "profecias"],
      },
      {
        label: "Organizar grupos",
        tags: ["liderazgo", "servicio"],
      },
      {
        label: "Tecnología y programación",
        tags: ["tecnologia", "innovacion"],
      },
    ],
  },

  {
    id: 3,
    question: "¿Qué tema leerías hoy?",
    options: [
      {
        label: "Historia",
        tags: ["historia", "teologia"],
      },
      {
        label: "Inteligencia Artificial",
        tags: ["tecnologia", "novedades"],
      },
      {
        label: "Hablar en público",
        tags: ["liderazgo", "comunicacion"],
      },
      {
        label: "Vida espiritual",
        tags: ["devocional", "teologia"],
      },
    ],
  },

  {
    id: 4,
    question: "¿Qué habilidad te gustaría desarrollar?",
    options: [
      {
        label: "Liderazgo",
        tags: ["liderazgo"],
      },
      {
        label: "Comunicación",
        tags: ["comunicacion"],
      },
      {
        label: "Tecnología",
        tags: ["tecnologia"],
      },
      {
        label: "Servicio",
        tags: ["servicio"],
      },
    ],
  },

];