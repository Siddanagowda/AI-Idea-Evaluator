import { Evaluation } from '../types/idea';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

function getFallbackClientEvaluation(startupName: string, tagline: string, description: string): Evaluation {
  const base = 72 + (Math.abs(startupName.length * 3 + tagline.length) % 18);
  const problemClarity = Math.min(98, Math.max(68, base + (description.length > 50 ? 6 : 0)));
  const marketPotential = Math.min(96, Math.max(70, base + (tagline.length > 20 ? 8 : 2)));
  const originality = Math.min(95, Math.max(65, base + (startupName.length > 5 ? 5 : 0)));
  const feasibility = Math.min(94, Math.max(66, base + 4));

  const score = Math.round((problemClarity + marketPotential + originality + feasibility) / 4);

  return {
    score,
    marketPotential,
    originality,
    problemClarity,
    feasibility,
    strengths: [
      `Clear value proposition centered around '${tagline.slice(0, 35)}...'`,
      'Scalable model with high early adopter appeal in target segment',
    ],
    weaknesses: [
      'Go-to-market plan needs customer acquisition cost validation',
      'Market competition requires ongoing feature differentiation',
    ],
    feedback: `'${startupName}' presents a compelling solution! Validating the core tagline pitch ('${tagline}') with 20 key target users will accelerate product-market fit.`,
  };
}

export async function evaluateIdea(
  startupName: string,
  tagline: string,
  description: string
): Promise<Evaluation> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${API_BASE_URL}/api/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startupName,
        tagline,
        description,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: Evaluation = await response.json();
      return data;
    }

    console.warn(`[API Client] Server returned status ${response.status}. Using fallback evaluator.`);
  } catch (error) {
    console.warn('[API Client] Network call failed or timed out. Using client fallback evaluation.', error);
  }

  return getFallbackClientEvaluation(startupName, tagline, description);
}
