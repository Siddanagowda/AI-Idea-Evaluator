export interface Evaluation {
  score: number;
  marketPotential: number;
  originality: number;
  problemClarity: number;
  feasibility: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
}

export interface Idea {
  id: string;
  startupName: string;
  tagline: string;
  description: string;
  evaluation: Evaluation;
  votes: number;
  createdAt: string;
}

export type SortOption = 'rating' | 'votes' | 'newest';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryLight: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  cardShadow: string;
}
