export interface Theme {
  mode: "light" | "dark";

  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceShadow: string;
  border: string;

  text: string;
  textSecondary: string;
  textInverse: string;

  primary: string;
  primaryBright: string;
  primarySoft: string;

  success: string;
  successSoft: string;
  error: string;
  errorSoft: string;
  accent: string;
  accentSoft: string;

  streak: string;
  achievement: string;
  income: string;
  expense: string;
  chartBar: string;
  chartBarActive: string;
}