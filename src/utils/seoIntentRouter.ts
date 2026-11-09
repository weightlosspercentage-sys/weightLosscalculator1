import { ToolMode } from '../components/HeroToolBox';

export type ClinicalFocus = 'standard' | 'bariatric' | 'glp1' | 'postpartum' | 'fasting';
export type RestaurantBrand = 'subway' | 'mcdonalds';

export interface RouteIntentResolution {
  locale: string;
  shouldRedirectToHome: boolean;
  redirectTarget: string;
  canonicalPath: string;
  toolMode: ToolMode;
  clinicalFocus: ClinicalFocus;
  restaurantBrand: RestaurantBrand;
  defaultWeightUnit: 'lbs' | 'kg';
  defaultBabyUnit: 'lbs_oz' | 'grams';
  customMetaTitle?: string;
  customMetaDescription?: string;
  customHeroTitle?: string;
  customHeroIntro?: string;
  intentBadge?: string;
  scrollSectionId?: string;
}

const SUPPORTED_LOCALES = ['de', 'it', 'ru', 'zh', 'ca', 'uk', 'au'] as const;

/**
 * Detects whether a URL is a thin/programmatic or competitor-branded route that should consolidate
 * and redirect to the homepage (or regional locale homepage) per SEO strategy.
 */
export function isProgrammaticRedirectPath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  if (/\/from-\d+(?:-\d+)?-to-\d+/.test(lower)) return true;
  if (lower.includes('/bmi/height-weight/')) return true;
  if (/weight-loss-\d+-percent-\d+/.test(lower)) return true;
  if (lower.includes('/calculator/newborn/index.html')) return true;
  if (/\/calculators\/weight-loss\/\d+/.test(lower)) return true;
  if (
    lower.includes('losertown') ||
    lower.includes('daves-weight-loss') ||
    lower.includes('sauna-weight-loss') ||
    lower.includes('treadmill-weight-loss') ||
    lower.includes('liposuction-weight-loss')
  ) {
    return true;
  }
  return false;
}

/**
 * Detects whether a URL is an unapproved research peptide or syringe reconstitution query
 * that should redirect to the safe, medically reviewed GLP-1 Clinical Trial Hub.
 */
export function isPeptideOrReconstitutionRedirectPath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return (
    lower.includes('retatrutide') ||
    lower.includes('tesamorelin') ||
    lower.includes('lipo-c') ||
    lower.includes('mots-c') ||
    lower.includes('sermorelin') ||
    lower.includes('aod-9604') ||
    lower.includes('reconstitution') ||
    lower.includes('semaglutide-mixing')
  );
}

/**
 * Resolves any incoming URL path from Google or Bing Search into the exact calculator
 * mode, clinical preset, unit system, and self-referencing SEO metadata so
 * user search intent is satisfied immediately above the fold.
 */
export function resolveSearchIntentFromPath(rawPathname: string): RouteIntentResolution {
  const cleanPath = (rawPathname || '/').split('?')[0].split('#')[0].toLowerCase();

  // 1. Detect locale prefix
  let locale = 'en';
  let localePrefix = '';
  for (const loc of SUPPORTED_LOCALES) {
    if (cleanPath === `/${loc}` || cleanPath.startsWith(`/${loc}/`)) {
      locale = loc;
      localePrefix = `/${loc}`;
      break;
    }
  }
  // Map /nz/ regional queries to Australia/Metric English locale
  if (cleanPath === '/nz' || cleanPath.startsWith('/nz/')) {
    locale = 'au';
    localePrefix = '/au';
  }

  const isMetricLocale = ['uk', 'au', 'de', 'it', 'ru', 'zh', 'ca'].includes(locale);
  const defaultWeightUnit: 'lbs' | 'kg' = locale === 'en' ? 'lbs' : 'kg';
  const defaultBabyUnit: 'lbs_oz' | 'grams' = ['de', 'it', 'ru', 'zh', 'au'].includes(locale)
    ? 'grams'
    : 'lbs_oz';

  const localeHome = localePrefix ? `${localePrefix}/` : '/';

  // 2A. Unapproved research peptide & vial reconstitution queries -> redirect to safe GLP-1 Clinical Trial Hub
  if (isPeptideOrReconstitutionRedirectPath(cleanPath)) {
    const glp1Target = '/calculators/glp1-weight-loss/';
    return {
      locale,
      shouldRedirectToHome: true,
      redirectTarget: glp1Target,
      canonicalPath: glp1Target,
      toolMode: 'adult',
      clinicalFocus: 'glp1',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: 'GLP-1, Semaglutide, Tirzepatide & Retatrutide Trial Weight Loss Calculator',
      customMetaDescription:
        'Calculate expected weight loss percentage across FDA-approved GLP-1 medications (Semaglutide, Tirzepatide) and published clinical trial benchmarks.',
      customHeroTitle: 'GLP-1 & Clinical Medication Weight Loss Calculator',
      customHeroIntro:
        'Compare your weight loss percentage against published STEP-1 (Semaglutide 14.9%), SURMOUNT-1 (Tirzepatide 20.9%), and Phase 2 clinical trial benchmarks with official FDA titration schedules.',
      intentBadge: 'Clinical Trial Trajectory • FDA Titration Reference & Safety Guide'
    };
  }

  // 2B. Programmatic & Competitor-Branded URLs -> redirect cleanly to homepage (or newborn hub for legacy newborn index.html)
  if (isProgrammaticRedirectPath(cleanPath)) {
    const isLegacyNewborn = cleanPath.includes('/calculator/newborn/index.html');
    const isActivityOrLosertown =
      cleanPath.includes('losertown') ||
      cleanPath.includes('daves-weight-loss') ||
      cleanPath.includes('treadmill') ||
      cleanPath.includes('sauna');
    const redirectTarget = isLegacyNewborn ? '/calculators/newborn-weight-loss/' : localeHome;
    return {
      locale,
      shouldRedirectToHome: true,
      redirectTarget,
      canonicalPath: redirectTarget,
      toolMode: isLegacyNewborn ? 'newborn' : isActivityOrLosertown ? 'bmr' : 'adult',
      clinicalFocus: 'standard',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit
    };
  }

  // Normalize trailing slash for canonical consistency
  const normalizedCanonical =
    cleanPath === '/'
      ? '/'
      : cleanPath.endsWith('/')
      ? cleanPath
      : `${cleanPath}/`;

  // 3. Newborn / Baby / Infant Weight Loss Intent (#1 Google & Bing Traffic Driver)
  if (
    cleanPath.includes('newborn-weight-loss') ||
    cleanPath.includes('baby-weight-loss') ||
    cleanPath.includes('infant-weight-loss') ||
    cleanPath.includes('calculating-weight-loss-in-newborns') ||
    cleanPath.includes('calculate-newborn-weight-loss')
  ) {
    const isUk = locale === 'uk';
    const isAu = locale === 'au';
    const regionLabel = isUk ? 'UK (NHS / NICE)' : isAu ? 'Australia' : 'AAP Clinical';

    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: normalizedCanonical,
      toolMode: 'newborn',
      clinicalFocus: 'standard',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: isUk
        ? 'Baby & Newborn Weight Loss Calculator UK (lbs/oz & Grams)'
        : 'Newborn & Infant Weight Loss Percentage Calculator (lbs/oz & Grams)',
      customMetaDescription:
        'Calculate newborn and infant weight loss percentage after birth in lbs/oz or grams: ((Birth Weight - Current Weight) ÷ Birth Weight) × 100. Instant AAP 5%, 7%, and 10% check.',
      customHeroTitle: isUk
        ? 'Baby & Newborn Weight Loss Percentage Calculator (UK)'
        : 'Newborn & Infant Weight Loss Percentage Calculator',
      customHeroIntro:
        'Enter your baby’s birth weight and current weight in pounds and ounces (lbs/oz) or grams to calculate exact postnatal weight loss percentage and check 24h, 48h, and 72h AAP clinical thresholds.',
      intentBadge: `${regionLabel} Postnatal Weight Check • Under 7% Normal / 10% Alert`
    };
  }

  // 4. Water Fasting, Intermittent Fasting (16:8) & OMAD Weight Loss Intent (#1 Bing Volume Cluster)
  if (
    cleanPath.includes('water-fast') ||
    cleanPath.includes('omad') ||
    cleanPath.includes('fasting-weight-loss') ||
    cleanPath.includes('weight-loss-from-fasting')
  ) {
    const isOmad = cleanPath.includes('omad');
    const isAuthoritativeRoute =
      cleanPath.includes('/calculators/water-fasting-weight-loss') ||
      cleanPath.includes('/calculators/omad-weight-loss') ||
      cleanPath.includes('/blog/water-fasting-weight-loss');
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: isAuthoritativeRoute
        ? normalizedCanonical
        : isOmad
        ? '/calculators/omad-weight-loss/'
        : '/calculators/water-fasting-weight-loss/',
      toolMode: 'adult',
      clinicalFocus: 'fasting',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: isOmad
        ? 'OMAD & Intermittent Fasting Weight Loss Calculator (Fat vs. Water)'
        : 'Water Fast Weight Loss Calculator (24h, 72h, 7-Day & OMAD Fat Loss)',
      customMetaDescription:
        'Calculate exact water fast and OMAD weight loss in lbs or kg. Separates early glycogen/water weight drop (Days 1–3) from true body fat oxidation (TDEE ÷ 3,500 kcal).',
      customHeroTitle: isOmad
        ? 'OMAD & Intermittent Fasting Weight Loss Calculator'
        : 'Water Fasting & OMAD Weight Loss Calculator',
      customHeroIntro:
        'Select your fasting duration (24h, 48h, 72h, 5-day, 7-day, 16:8, or OMAD 23:1) to see both total scale weight drop (water + glycogen + fat) and net post-refeed fat loss.',
      intentBadge: 'Metabolic Fasting Model • Separates Glycogen Water Drop vs. True Adipose Fat Loss'
    };
  }

  // 5. Bariatric Surgery (Gastric Sleeve / RNY Bypass / Duodenal Switch / %EWL by Month) Intent
  if (
    cleanPath.includes('bariatric') ||
    cleanPath.includes('gastric-sleeve') ||
    cleanPath.includes('gastric-bypass') ||
    cleanPath.includes('rny') ||
    cleanPath.includes('duodenal-switch') ||
    cleanPath.includes('excess-weight-loss')
  ) {
    const isAuthoritativeBariatric = cleanPath.includes('/calculators/bariatric-surgery-weight-loss');
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: isAuthoritativeBariatric
        ? normalizedCanonical
        : '/calculators/bariatric-surgery-weight-loss/',
      toolMode: 'adult',
      clinicalFocus: 'bariatric',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: 'Bariatric Weight Loss Calculator by Month (%EWL, RNY Bypass, Sleeve & Duodenal Switch)',
      customMetaDescription:
        'Calculate Percentage of Excess Weight Loss (%EWL), Total Body Weight Loss (%TBWL), and month-by-month post-op weight projections for RNY gastric bypass, sleeve, and duodenal switch.',
      customHeroTitle: 'Bariatric Surgery Weight Loss Calculator (%EWL & Monthly Timeline)',
      customHeroIntro:
        'Track Excess Weight Loss (%EWL) and month-by-month post-op projections (Months 1, 3, 6, 12, and 18) for Roux-en-Y Gastric Bypass (RNY), Vertical Sleeve Gastrectomy (VSG), and Duodenal Switch.',
      intentBadge: 'ASMBS Bariatric Protocol • RNY, Gastric Sleeve & Duodenal Switch (%EWL by Month)'
    };
  }

  // 6. GLP-1 (Semaglutide / Ozempic / Wegovy / Tirzepatide / Mounjaro / Phentermine) Intent
  if (
    cleanPath.includes('glp1') ||
    cleanPath.includes('glp-1') ||
    cleanPath.includes('ozempic') ||
    cleanPath.includes('wegovy') ||
    cleanPath.includes('mounjaro') ||
    cleanPath.includes('zepbound') ||
    cleanPath.includes('semaglutide') ||
    cleanPath.includes('tirzepatide') ||
    cleanPath.includes('phentermine')
  ) {
    const isAuthoritativeGlp1 = cleanPath.includes('/calculators/glp1-weight-loss');
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: isAuthoritativeGlp1 ? normalizedCanonical : '/calculators/glp1-weight-loss/',
      toolMode: 'adult',
      clinicalFocus: 'glp1',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: 'GLP-1, Semaglutide, Tirzepatide & Mounjaro Weight Loss Calculator (+ FDA Titration PDF)',
      customMetaDescription:
        'Calculate weight loss percentage on Semaglutide (Ozempic/Wegovy), Tirzepatide (Mounjaro/Zepbound), Phentermine, and clinical trial benchmarks with printable FDA titration schedules.',
      customHeroTitle: 'GLP-1, Semaglutide & Tirzepatide Weight Loss Calculator',
      customHeroIntro:
        'Compare your weight loss percentage with STEP-1 (Semaglutide 14.9%), SURMOUNT-1 (Tirzepatide 20.9%), and Phase 2 clinical trials, complete with official FDA weekly titration schedules.',
      intentBadge: 'GLP-1 Clinical Trajectory • Semaglutide, Tirzepatide & FDA Titration Schedule'
    };
  }

  // 7. Postpartum & Breastfeeding Weight Loss Intent
  if (cleanPath.includes('postpartum') || cleanPath.includes('breastfeeding')) {
    const isAuthoritativePostpartum = cleanPath.includes('/calculators/postpartum-weight-loss');
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: isAuthoritativePostpartum
        ? normalizedCanonical
        : '/calculators/postpartum-weight-loss/',
      toolMode: 'adult',
      clinicalFocus: 'postpartum',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: 'Postpartum & Breastfeeding Weight Loss Calorie Calculator',
      customMetaDescription:
        'Calculate postpartum weight loss percentage and safe breastfeeding calorie targets (+450 to +500 kcal/day lactation output) to lose weight without reducing milk supply.',
      customHeroTitle: 'Postpartum & Breastfeeding Weight Loss Calculator',
      customHeroIntro:
        'Track your gradual postpartum weight change from pre-pregnancy or delivery weight and calculate breastfeeding-safe daily calories that protect your milk supply.',
      intentBadge: 'Postpartum & Lactation Mode • Protects Maternal Milk Supply (+450 kcal/day)'
    };
  }

  // 8. Restaurant Nutrition Intent (McDonald's & Subway)
  if (cleanPath.includes('/restaurants/mcdonalds') || cleanPath.includes('mcdonalds')) {
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: normalizedCanonical,
      toolMode: 'subway',
      clinicalFocus: 'standard',
      restaurantBrand: 'mcdonalds',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: "McDonald's Calorie & Nutrition Calculator (Meal Builder)",
      customMetaDescription:
        "Calculate total calories, protein, and daily deficit impact for McDonald's burgers, McNuggets, fries, and drinks instantly.",
      customHeroTitle: "McDonald's & Restaurant Calorie Calculator",
      customHeroIntro:
        "Build your McDonald's or Subway meal below to calculate total calories, protein, and how it fits into your daily weight loss calorie target.",
      intentBadge: "McDonald's & Subway Nutrition Builder"
    };
  }

  if (cleanPath.includes('/restaurants/subway') || cleanPath.includes('subway')) {
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: normalizedCanonical,
      toolMode: 'subway',
      clinicalFocus: 'standard',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: 'Subway Calorie & Nutrition Calculator (6-Inch & Footlong)',
      customMetaDescription:
        'Calculate exact Subway sandwich calories for 6-inch and Footlong subs across breads, proteins, cheeses, and sauces.',
      customHeroTitle: 'Subway & Restaurant Calorie Calculator',
      customHeroIntro:
        'Compare 6-inch and Footlong sandwich combinations, breads, proteins, and dressings to stay on track with your daily calorie deficit.',
      intentBadge: 'Restaurant Meal & Macro Calculator'
    };
  }

  // 9. BMR / TDEE / Calorie Deficit / 12-Week Forecast / Activity Calorie Calculators
  if (
    cleanPath.includes('/bmr') ||
    cleanPath.includes('/tdee') ||
    cleanPath.includes('calorie-deficit') ||
    cleanPath.includes('/calculators/calorie') ||
    cleanPath.includes('/walking') ||
    cleanPath.includes('/rowing') ||
    cleanPath.includes('/running') ||
    cleanPath.includes('/cycling')
  ) {
    const isDeficit = cleanPath.includes('deficit');
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: normalizedCanonical,
      toolMode: 'bmr',
      clinicalFocus: 'standard',
      restaurantBrand: 'subway',
      defaultWeightUnit: isMetricLocale ? 'kg' : 'lbs',
      defaultBabyUnit,
      customMetaTitle: isDeficit
        ? 'Calorie Deficit & 12-Week Weight Loss Projection Calculator (BMR + TDEE)'
        : 'BMR & Daily Calorie Calculator (Mifflin-St Jeor TDEE + Weekly Forecast)',
      customMetaDescription:
        'Calculate your Basal Metabolic Rate (BMR), Maintenance Calories (TDEE), 500-calorie daily deficit, and week-by-week weight projection table.',
      customHeroTitle: isDeficit
        ? 'Calorie Deficit & 12-Week Weight Loss Projection Calculator'
        : 'BMR, TDEE & Weekly Weight Loss Projection Calculator',
      customHeroIntro:
        'Estimate your resting metabolic burn (BMR), total daily energy expenditure (TDEE), and view your 12-week projected weight loss timeline.',
      intentBadge: 'Mifflin-St Jeor Equation • BMR, TDEE & 12-Week Weight Projection'
    };
  }

  // 9. High-Impression Blog & Percentage Chart Guides
  if (cleanPath.includes('/blog/')) {
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: normalizedCanonical,
      toolMode: 'adult',
      clinicalFocus: 'standard',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: 'Weight Loss Percentage Chart, Formula & Monthly Guide',
      customMetaDescription:
        'Step-by-step weight loss percentage formula ((Start - Current) ÷ Start) × 100, printable 5% to 20% milestone chart, and safe monthly fat loss pace.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  // 10. Default Homepage / Regional Adult Weight Loss Percentage Calculator
  return {
    locale,
    shouldRedirectToHome: false,
    redirectTarget: normalizedCanonical,
    canonicalPath: cleanPath.includes('/calculators/') ? normalizedCanonical : localeHome,
    toolMode: 'adult',
    clinicalFocus: 'standard',
    restaurantBrand: 'subway',
    defaultWeightUnit,
    defaultBabyUnit
  };
}
