import { SILOS_DATA, SiloMetadata } from '../data/keywordMatrix';
import type { ToolMode } from '../components/HeroToolBox';

export interface SearchableToolItem {
  id: string;
  anchor: string;
  title: string;
  category: 'Calculator' | 'Clinical Guide' | 'FAQ & Reference';
  summary: string;
  calculatorMode?: ToolMode;
  keywords: string[];
  matchedKeyword?: string;
}

const TOOL_SUMMARIES: Record<
  string,
  {
    summary: string;
    category: 'Calculator' | 'Clinical Guide' | 'FAQ & Reference';
    calculatorMode?: ToolMode;
  }
> = {
  percentage: {
    summary: 'Calculate body weight loss percentage from starting and current weight in lbs or kg.',
    category: 'Calculator',
    calculatorMode: 'adult'
  },
  newborn: {
    summary: 'Check newborn weight change in the first week after birth using AAP clinical guidelines.',
    category: 'Calculator',
    calculatorMode: 'newborn'
  },
  calorie: {
    summary: 'Compare everyday sandwich calories, cycling burn, and breastfeeding calorie needs.',
    category: 'Calculator',
    calculatorMode: 'subway'
  },
  nutrition: {
    summary: 'Review protein, carbs, fat, and sodium targets when building meals on the go.',
    category: 'Calculator',
    calculatorMode: 'subway'
  },
  lbs: {
    summary: 'Height and weight BMI reference examples for adults across standard weight ranges.',
    category: 'Clinical Guide',
    calculatorMode: 'adult'
  },
  much: {
    summary: 'See total pounds or kilograms lost, percentage change, and healthy monthly expectations.',
    category: 'FAQ & Reference',
    calculatorMode: 'adult'
  },
  calories: {
    summary: 'Estimate resting calories burned, stationary bike workouts, and daily calorie targets.',
    category: 'Calculator',
    calculatorMode: 'bmr'
  },
  percent: {
    summary: 'Step-by-step percent weight change equations and 5% to 10% body weight benchmarks.',
    category: 'Clinical Guide',
    calculatorMode: 'adult'
  },
  baby: {
    summary: 'Track infant and baby weight changes in pounds, ounces, or grams after hospital discharge.',
    category: 'Clinical Guide',
    calculatorMode: 'newborn'
  },
  keto: {
    summary: 'Low-carb ketogenic macro ratios (70% fat, 25% protein, 5% carbs) paired with TDEE.',
    category: 'Calculator',
    calculatorMode: 'bmr'
  },
  'metabolic-rate': {
    summary: 'Estimate Basal Metabolic Rate (BMR) and Resting Metabolic Rate (RMR) with Mifflin-St Jeor.',
    category: 'Calculator',
    calculatorMode: 'bmr'
  },
  'gastric-bypass': {
    summary: 'Expected weight loss timeline at 3, 6, 12, and 18 months after gastric sleeve or bypass.',
    category: 'Calculator',
    calculatorMode: 'adult'
  },
  'calculate-birth': {
    summary: 'Compare newborn birth weight against current weight to monitor early fluid loss.',
    category: 'Calculator',
    calculatorMode: 'newborn'
  },
  'per-month': {
    summary: 'Safe, sustainable monthly weight loss rates (4 to 8 lbs per month) recommended by doctors.',
    category: 'Clinical Guide',
    calculatorMode: 'adult'
  },
  bmr: {
    summary: 'Calculate resting calorie burn and compare BMR against Total Daily Energy Expenditure.',
    category: 'Calculator',
    calculatorMode: 'bmr'
  },
  infant: {
    summary: 'Pediatric growth curve checkpoints and expected weekly weight gain in the first months.',
    category: 'Clinical Guide',
    calculatorMode: 'newborn'
  },
  bmi: {
    summary: 'Adult Body Mass Index (BMI) formula and height-to-weight category charts.',
    category: 'Clinical Guide',
    calculatorMode: 'adult'
  },
  subway: {
    summary: 'Customize sandwich breads, lean proteins, cheeses, and sauces with live macro totals.',
    category: 'Calculator',
    calculatorMode: 'subway'
  },
  'bariatric-surgery': {
    summary: 'Compare Excess Weight Loss (EWL) and Total Body Weight Loss (TBWL) after surgery.',
    category: 'Calculator',
    calculatorMode: 'adult'
  },
  'biggest-loser': {
    summary: 'Fair percentage-based scoring for office, family, and group fitness weight loss challenges.',
    category: 'Calculator',
    calculatorMode: 'adult'
  },
  calculate: {
    summary: 'Best practices for morning weigh-ins and consistent weekly weight loss tracking.',
    category: 'Clinical Guide',
    calculatorMode: 'adult'
  },
  body: {
    summary: 'How medical studies use Total Body Weight Loss (TBWL) to measure health improvements.',
    category: 'Calculator',
    calculatorMode: 'adult'
  },
  pounds: {
    summary: 'Quick ounce-to-pound conversions such as finding 5% or 10% of a 7 lb birth weight.',
    category: 'Clinical Guide',
    calculatorMode: 'newborn'
  },
  tdee: {
    summary: 'Use your Total Daily Energy Expenditure to set a steady 300 to 500 calorie daily deficit.',
    category: 'Calculator',
    calculatorMode: 'bmr'
  }
};

export const ALL_SEARCHABLE_TOOLS: SearchableToolItem[] = SILOS_DATA.map((silo: SiloMetadata) => {
  const meta = TOOL_SUMMARIES[silo.id] || {
    summary: `Clinical reference guide and calculator for ${silo.hubKeyword}.`,
    category: silo.type === 'tool' ? 'Calculator' : silo.type === 'question' ? 'FAQ & Reference' : 'Clinical Guide'
  };

  const allKeywords = Array.from(
    new Set([
      silo.hubKeyword,
      ...silo.subtopics.flatMap((st) => [st.title, ...st.keywords])
    ])
  );

  return {
    id: silo.id,
    anchor: silo.anchor,
    title: silo.hubKeyword,
    category: meta.category,
    summary: meta.summary,
    calculatorMode: meta.calculatorMode,
    keywords: allKeywords
  };
});

export function searchTools(rawQuery: string): SearchableToolItem[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return ALL_SEARCHABLE_TOOLS;
  }

  const queryTokens = query.split(/\s+/).filter(Boolean);

  const scored: { item: SearchableToolItem; score: number }[] = [];

  for (const tool of ALL_SEARCHABLE_TOOLS) {
    const titleLower = tool.title.toLowerCase();
    const summaryLower = tool.summary.toLowerCase();
    const idLower = tool.id.toLowerCase();
    const categoryLower = tool.category.toLowerCase();

    let score = 0;
    let matchedKeyword: string | undefined;

    // Exact or prefix match on title
    if (titleLower === query) {
      score += 120;
    } else if (titleLower.startsWith(query)) {
      score += 90;
    } else if (titleLower.includes(query)) {
      score += 70;
    }

    // Match on id or category
    if (idLower.includes(query)) {
      score += 50;
    }
    if (categoryLower.includes(query)) {
      score += 25;
    }

    // Match on summary
    if (summaryLower.includes(query)) {
      score += 35;
    }

    // Check subtopic keywords
    for (const kw of tool.keywords) {
      const kwLower = kw.toLowerCase();
      if (kwLower === query) {
        score += 65;
        if (!matchedKeyword) matchedKeyword = kw;
      } else if (kwLower.includes(query)) {
        score += 30;
        if (!matchedKeyword) matchedKeyword = kw;
      }
    }

    // Multi-word token matching across title + summary + keywords
    const combinedText = `${titleLower} ${summaryLower} ${idLower} ${tool.keywords.join(' ').toLowerCase()}`;
    const allTokensMatch = queryTokens.every((token) => combinedText.includes(token));

    if (allTokensMatch) {
      score += 25;
      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 15;
        if (summaryLower.includes(token)) score += 8;
      }
    } else {
      // If not all tokens match anywhere in the tool's metadata, skip unless single-string already matched
      if (score === 0) continue;
    }

    if (score > 0) {
      scored.push({
        item: matchedKeyword && !titleLower.includes(query) ? { ...tool, matchedKeyword } : tool,
        score
      });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}
