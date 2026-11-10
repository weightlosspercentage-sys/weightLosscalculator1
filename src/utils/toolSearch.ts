import { SILOS_DATA, SiloMetadata } from '../data/keywordMatrix';
import type { ToolMode } from '../components/HeroToolBox';
import type { ClinicalFocus, RestaurantBrand } from './seoIntentRouter';

export interface SearchableToolItem {
  id: string;
  anchor: string;
  title: string;
  category: 'Calculator' | 'Clinical Guide' | 'FAQ & Reference';
  summary: string;
  calculatorMode?: ToolMode;
  clinicalFocus?: ClinicalFocus;
  restaurantBrand?: RestaurantBrand;
  routePath?: string;
  keywords: string[];
  matchedKeyword?: string;
}

const TOOL_SUMMARIES: Record<
  string,
  {
    summary: string;
    category: 'Calculator' | 'Clinical Guide' | 'FAQ & Reference';
    calculatorMode?: ToolMode;
    clinicalFocus?: ClinicalFocus;
  }
> = {
  percentage: {
    summary: 'Calculate body weight loss percentage from starting and current weight in lbs or kg.',
    category: 'Calculator',
    calculatorMode: 'adult',
    clinicalFocus: 'standard'
  },
  newborn: {
    summary: 'Check newborn weight change in the first week after birth using AAP clinical guidelines.',
    category: 'Calculator',
    calculatorMode: 'newborn'
  },
  'water-fasting': {
    summary: 'Estimate 24h to 7-day water fast, OMAD, and intermittent fasting weight loss separating glycogen water drop from true fat burn.',
    category: 'Calculator',
    calculatorMode: 'adult',
    clinicalFocus: 'fasting'
  },
  'glp1-calculator': {
    summary: 'Compare Semaglutide (Ozempic/Wegovy 14.9%), Tirzepatide (Mounjaro/Zepbound 20.9%), and Retatrutide clinical trial %TBWL timelines.',
    category: 'Calculator',
    calculatorMode: 'adult',
    clinicalFocus: 'glp1'
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
    summary: 'Expected weight loss timeline at 1, 3, 6, 12, and 18 months after RNY bypass, gastric sleeve, or duodenal switch.',
    category: 'Calculator',
    calculatorMode: 'adult',
    clinicalFocus: 'bariatric'
  },
  'calculate-birth': {
    summary: 'Compare newborn birth weight against current weight to monitor early fluid loss.',
    category: 'Calculator',
    calculatorMode: 'newborn'
  },
  'per-month': {
    summary: 'Safe, sustainable monthly weight loss rates (4 to 8 lbs per month) and weekly goal projections.',
    category: 'Clinical Guide',
    calculatorMode: 'adult'
  },
  bmr: {
    summary: 'Calculate resting calorie burn, TDEE, and a 12-week Losertown-style weight forecast table.',
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
    summary: 'Compare Excess Weight Loss (%EWL) and Total Body Weight Loss (%TBWL) after RNY, VSG, or Duodenal Switch.',
    category: 'Calculator',
    calculatorMode: 'adult',
    clinicalFocus: 'bariatric'
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

const SILO_TOOLS: SearchableToolItem[] = SILOS_DATA.map((silo: SiloMetadata) => {
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
    clinicalFocus: meta.clinicalFocus,
    keywords: allKeywords
  };
});

export const NEW_INTENT_TOOLS: SearchableToolItem[] = [
  {
    id: 'how-much-weight-can-i-lose-in-a-month',
    anchor: '#bmr',
    title: 'How Much Weight Can I Lose in a Month Calculator',
    category: 'Calculator',
    summary: 'Project monthly weight loss from your daily calorie deficit and TDEE. Safe pace: 1 to 2 lbs per week.',
    calculatorMode: 'bmr',
    routePath: '/calculators/how-much-weight-can-i-lose-in-a-month/',
    keywords: [
      'how much weight can i lose in a month calculator',
      'how much weight can i lose in a month',
      'how much weight can you lose in a month',
      'pace calculator',
      'weight loss pace calculator',
      'weight loss timeline calculator',
      'monthly weight loss projection',
      'safe weight loss timeline'
    ]
  },
  {
    id: 'fat-loss',
    anchor: '#percentage',
    title: 'Fat Loss Percentage Calculator',
    category: 'Calculator',
    summary: 'Calculate fat loss percentage from starting and current weight: ((Start - Current) ÷ Start) × 100.',
    calculatorMode: 'adult',
    routePath: '/calculators/fat-loss/',
    keywords: [
      'fat loss percentage calculator',
      'fat loss calculator',
      'body fat loss calculator',
      'calculate fat loss percentage',
      'track fat loss',
      'fat loss %'
    ]
  },
  {
    id: 'water-intake',
    anchor: '#calculator-hero',
    title: 'Water Intake Calculator for Weight Loss',
    category: 'Calculator',
    summary: 'Calculate daily hydration target by body weight: about 30 to 35 ml of water per kilogram each day.',
    calculatorMode: 'adult',
    routePath: '/calculators/water-intake/',
    keywords: [
      'water intake calculator',
      'water intake calculator for weight loss',
      'daily water intake calculator',
      'water intake for weight loss',
      'hydration calculator',
      'water calculator ml'
    ]
  },
  {
    id: 'five-guys',
    anchor: '#calorie',
    title: 'Five Guys Calorie & Nutrition Calculator',
    category: 'Calculator',
    summary: 'Build your Five Guys burger and fresh-cut peanut oil fries below from official Five Guys nutrition values.',
    calculatorMode: 'subway',
    restaurantBrand: 'five-guys',
    routePath: '/restaurants/five-guys/',
    keywords: [
      'five guys calorie calculator',
      'five guys nutrition calculator',
      'five guys calories',
      'five guys burger calories',
      'five guys fries calories',
      '5 guys calories calculator',
      'five guys meal builder'
    ]
  },
  {
    id: 'walking',
    anchor: '#walking',
    title: 'Walking Calorie & Weight Loss Calculator',
    category: 'Calculator',
    summary: 'Calculate calories burned walking by speed, distance, incline, and body weight to project weekly deficit.',
    calculatorMode: 'bmr',
    routePath: '/calculators/walking/',
    keywords: [
      'walking calorie calculator',
      'walking weight loss calculator',
      'calories burned walking calculator',
      'walking calories',
      'treadmill walking calories',
      'walking speed calorie burn'
    ]
  },
  {
    id: 'running',
    anchor: '#running',
    title: 'Running Calorie & Weight Loss Calculator',
    category: 'Calculator',
    summary: 'Calculate running calories burned by pace, distance, and body weight. Project net caloric deficit.',
    calculatorMode: 'bmr',
    routePath: '/calculators/running/',
    keywords: [
      'running calorie calculator',
      'running calories burned',
      'running weight loss calculator',
      'calories burned running calculator',
      'running pace calories',
      'running distance and burn'
    ]
  },
  {
    id: 'cycling',
    anchor: '#cycling',
    title: 'Cycling Calorie & Weight Loss Calculator',
    category: 'Calculator',
    summary: 'Calculate cycling calories burned by speed, body weight, and duration for indoor or outdoor rides.',
    calculatorMode: 'bmr',
    routePath: '/calculators/cycling/',
    keywords: [
      'cycling calorie calculator',
      'cycling calories burned',
      'bike calorie calculator',
      'stationary bike calorie calculator',
      'cycling weight loss calculator',
      'biking calories'
    ]
  },
  {
    id: 'rowing',
    anchor: '#rowing',
    title: 'Rowing Machine Calorie & Weight Loss Calculator',
    category: 'Calculator',
    summary: 'Calculate rowing machine calories burned by split pace, intensity, and duration for full-body ergometer burn.',
    calculatorMode: 'bmr',
    routePath: '/calculators/rowing/',
    keywords: [
      'rowing machine calorie calculator',
      'rowing calories burned',
      'ergometer calories',
      'rowing weight loss calculator',
      'calories burned rowing machine',
      'rowing split calories'
    ]
  },
  {
    id: 'mcdonalds',
    anchor: '#calorie',
    title: "McDonald's Calorie & Nutrition Calculator",
    category: 'Calculator',
    summary: "Calculate total meal calories, protein, and deficit impact for McDonald's burgers, nuggets, fries, and drinks.",
    calculatorMode: 'subway',
    restaurantBrand: 'mcdonalds',
    routePath: '/restaurants/mcdonalds/',
    keywords: [
      "mcdonald's calorie calculator",
      'mcdonalds calories',
      'mcdonalds meal builder',
      'mcdonalds nutrition calculator',
      'mcdonalds deficit'
    ]
  },
  {
    id: 'calorie-deficit',
    anchor: '#bmr',
    title: 'Calorie Deficit Calculator',
    category: 'Calculator',
    summary: 'Calculate your exact daily calorie deficit target (e.g. 500 kcal/day for 1 lb/week fat loss) from your TDEE.',
    calculatorMode: 'bmr',
    routePath: '/calculators/calorie-deficit/',
    keywords: [
      'calorie deficit calculator',
      'daily calorie deficit calculator',
      'calorie deficit for weight loss',
      'deficit calculator',
      'calculate calorie deficit'
    ]
  },
  {
    id: 'postpartum',
    anchor: '#newborn',
    title: 'Postpartum & Breastfeeding Weight Loss Calculator',
    category: 'Calculator',
    summary: 'Calculate safe breastfeeding calorie targets (+450 to +500 kcal/day) and postpartum weight loss trajectory.',
    calculatorMode: 'adult',
    clinicalFocus: 'postpartum',
    routePath: '/calculators/postpartum-weight-loss/',
    keywords: [
      'postpartum weight loss calculator',
      'breastfeeding calorie calculator',
      'weight loss while breastfeeding calculator',
      'breastfeeding calorie counter',
      'nursing mother calorie calculator'
    ]
  },
  {
    id: 'omad',
    anchor: '#water-fasting',
    title: 'OMAD (One Meal A Day) Weight Loss Calculator',
    category: 'Calculator',
    summary: 'Estimate fasting weight loss, glycogen depletion, and true fat burn on a 23:1 OMAD protocol.',
    calculatorMode: 'adult',
    clinicalFocus: 'fasting',
    routePath: '/calculators/omad-weight-loss/',
    keywords: [
      'omad weight loss calculator',
      'omad calculator',
      'one meal a day weight loss calculator',
      'omad fasting calculator',
      'omad results calculator'
    ]
  }
];

export const ALL_SEARCHABLE_TOOLS: SearchableToolItem[] = [
  ...SILO_TOOLS,
  ...NEW_INTENT_TOOLS
];

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
