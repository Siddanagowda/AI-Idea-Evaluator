import AsyncStorage from '@react-native-async-storage/async-storage';
import { Idea, ThemeMode } from '../types/idea';

const STORAGE_KEYS = {
  IDEAS: '@startup_evaluator_ideas_v1',
  VOTED_IDEAS: '@startup_evaluator_voted_ideas_v1',
  THEME: '@startup_evaluator_theme_v1',
};

const SEED_IDEAS: Idea[] = [
  {
    id: 'seed-1',
    startupName: 'EcoTrack AI',
    tagline: 'Automated Carbon Footprint Intelligence for SMBs',
    description:
      'EcoTrack AI integrates directly with business accounting and supply chain software to automatically calculate, benchmark, and reduce carbon emissions for small to medium enterprises.',
    evaluation: {
      score: 92,
      marketPotential: 94,
      originality: 89,
      problemClarity: 95,
      feasibility: 90,
      strengths: [
        'Surging regulatory pressure and enterprise ESG requirements for suppliers',
        'Automated API integration eliminates manual data entry friction',
      ],
      weaknesses: [
        'Integration maintenance across diverse accounting platforms',
        'Requires strong trust and data privacy guarantees',
      ],
      feedback:
        'EcoTrack AI taps into an urgent market transition. Focusing on mid-market compliance automated reporting will drive rapid initial contract wins.',
    },
    votes: 48,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'seed-2',
    startupName: 'SkillFlow',
    tagline: '10-Minute Micro-Mentorship for Tech Professionals',
    description:
      'SkillFlow connects junior developers and designers with seasoned industry mentors for async 10-minute code reviews and targeted career feedback on demand.',
    evaluation: {
      score: 88,
      marketPotential: 87,
      originality: 86,
      problemClarity: 92,
      feasibility: 87,
      strengths: [
        'Solves long feedback loops in traditional mentorship programs',
        'Async voice and video snippets lower mentor time commitment',
      ],
      weaknesses: [
        'Two-sided marketplace chicken-and-egg chicken problem',
        'Quality control and mentor vetting consistency',
      ],
      feedback:
        'Great approach to micro-learning. Retaining high-quality mentors through micro-compensation will be key to user retention.',
    },
    votes: 39,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'seed-3',
    startupName: 'MealCraft',
    tagline: 'Zero-Waste Smart Meal Planning & Pantry Sync',
    description:
      'MealCraft scans receipts, tracks fridge expiration dates, and uses generative AI to curate custom weekly recipe plans that utilize leftover ingredients before they expire.',
    evaluation: {
      score: 84,
      marketPotential: 86,
      originality: 82,
      problemClarity: 88,
      feasibility: 80,
      strengths: [
        'Direct household grocery bill cost savings appeals to broad demographic',
        'Gamified zero-waste metrics create daily active usage habits',
      ],
      weaknesses: [
        'Receipt OCR scanning accuracy can vary across store formats',
        'Sustained user habit building requires seamless app interactions',
      ],
      feedback:
        'Highly practical consumer concept. Integrating automated grocery delivery store replenishment could unlock lucrative affiliate revenue streams.',
    },
    votes: 31,
    createdAt: new Date().toISOString(),
  },
];

export async function getStoredIdeas(): Promise<Idea[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.IDEAS);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    // First time launch: seed initial ideas
    await AsyncStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(SEED_IDEAS));
    return SEED_IDEAS;
  } catch (e) {
    console.error('Failed to load ideas from AsyncStorage', e);
    return SEED_IDEAS;
  }
}

export async function saveIdea(idea: Idea): Promise<Idea[]> {
  try {
    const existing = await getStoredIdeas();
    const updated = [idea, ...existing];
    await AsyncStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save idea to AsyncStorage', e);
    throw e;
  }
}

export async function upvoteIdea(ideaId: string): Promise<{ ideas: Idea[]; success: boolean }> {
  try {
    const votedIdeas = await getVotedIdeaIds();
    if (votedIdeas.includes(ideaId)) {
      return { ideas: await getStoredIdeas(), success: false };
    }

    const existing = await getStoredIdeas();
    const updated = existing.map((idea) => {
      if (idea.id === ideaId) {
        return { ...idea, votes: idea.votes + 1 };
      }
      return idea;
    });

    await AsyncStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(updated));
    
    // Track vote
    const updatedVoted = [...votedIdeas, ideaId];
    await AsyncStorage.setItem(STORAGE_KEYS.VOTED_IDEAS, JSON.stringify(updatedVoted));

    return { ideas: updated, success: true };
  } catch (e) {
    console.error('Failed to upvote idea', e);
    return { ideas: await getStoredIdeas(), success: false };
  }
}

export async function getVotedIdeaIds(): Promise<string[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.VOTED_IDEAS);
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load voted ideas', e);
    return [];
  }
}

export async function getStoredTheme(): Promise<ThemeMode> {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as ThemeMode) || 'light';
  } catch (e) {
    return 'light';
  }
}

export async function saveStoredTheme(theme: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Failed to save theme preference', e);
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.IDEAS);
    await AsyncStorage.removeItem(STORAGE_KEYS.VOTED_IDEAS);
    await AsyncStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(SEED_IDEAS));
  } catch (e) {
    console.error('Failed to clear AsyncStorage data', e);
  }
}
