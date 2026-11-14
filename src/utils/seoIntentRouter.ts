import { ToolMode } from '../components/HeroToolBox';

export type ClinicalFocus = 'standard' | 'bariatric' | 'glp1' | 'postpartum' | 'fasting';
export type RestaurantBrand = 'subway' | 'mcdonalds' | 'five-guys';

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

  // 3A. Baby Weight Loss Intent — own title so "baby weight loss percentage calculator"
  // (pos 5.39, 0 clicks) gets a title match instead of sharing the newborn title.
  if (cleanPath.includes('baby-weight-loss')) {
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
        ? 'Baby Weight Loss Calculator UK (lbs/oz & Grams)'
        : 'Baby Weight Loss Calculator (lbs/oz & Grams)',
      customMetaDescription:
        'Calculate baby weight loss percentage after birth in lbs/oz or grams: ((Birth Weight - Current Weight) ÷ Birth Weight) × 100. Check the 7% normal and 10% alert thresholds.',
      customHeroTitle: isUk
        ? 'Baby Weight Loss Calculator (UK)'
        : 'Baby Weight Loss Calculator',
      customHeroIntro:
        'Enter your baby’s birth weight and current weight in pounds and ounces (lbs/oz) or grams to calculate exact weight loss percentage and check AAP clinical thresholds.',
      intentBadge: `${regionLabel} Baby Weight Check • Under 7% Normal / 10% Alert`
    };
  }

  // 3. Newborn / Infant Weight Loss Intent (#1 Google & Bing Traffic Driver)
  if (
    cleanPath.includes('newborn-weight-loss') ||
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

  // 7B. Pace: "How much weight can I lose in a month" calculator (P1 — new tool page).
  // Reuses the BMR/TDEE mode: its 12-week projection answers the monthly pace question.
  if (
    cleanPath.includes('how-much-weight-can-i-lose-in-a-month') ||
    cleanPath.includes('how-much-weight-can-you-lose-in-a-month')
  ) {
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
      customMetaTitle: 'How Much Weight Can I Lose in a Month Calculator (Safe Pace + Timeline)',
      customMetaDescription:
        'Project how much weight you can lose in a month from your daily calorie deficit. A 500 kcal/day deficit loses about 1 lb per week; the safe pace is 1 to 2 lbs per week.',
      customHeroTitle: 'How Much Weight Can I Lose in a Month Calculator',
      customHeroIntro:
        'A how-much-weight-can-I-lose calculator is a projection tool that converts a daily calorie deficit and a target date into expected weight loss. Enter your stats and daily intake to see your monthly projection.',
      intentBadge: 'Safe Pace • 1–2 lbs per Week • 500 kcal/day ≈ 1 lb/week'
    };
  }

  // 7C. Fat-loss intent (P2): /calculators/fat-loss/ — own title on the adult % tool.
  if (cleanPath.includes('/calculators/fat-loss')) {
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
      customMetaTitle: 'Fat Loss Percentage Calculator (Track Fat vs. Scale Weight)',
      customMetaDescription:
        'Calculate fat loss percentage from your starting and current weight: ((Start - Current) ÷ Start) × 100. Track progress toward your goal and keep the loss mostly fat.',
      customHeroTitle: 'Fat Loss Percentage Calculator',
      customHeroIntro:
        'A fat loss percentage calculator is a tracking tool that converts your starting weight and current weight into the percentage of weight lost. Pair it with enough protein and strength training so the loss comes mostly from fat.',
      intentBadge: 'Fat Loss % • Track Progress vs. Your Goal'
    };
  }

  // 7D. Water-intake intent (P3): /calculators/water-intake/ — own title on the adult % tool.
  // No dedicated water widget exists yet; the hero states the 30–35 ml/kg rule directly.
  if (cleanPath.includes('/calculators/water-intake')) {
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
      customMetaTitle: 'Water Intake Calculator for Weight Loss (Daily ml by Body Weight)',
      customMetaDescription:
        'Calculate daily water intake by body weight: about 30 to 35 ml of water per kilogram of body weight each day. Track the weight change that follows with the percentage calculator below.',
      customHeroTitle: 'Water Intake Calculator for Weight Loss',
      customHeroIntro:
        'A water intake calculator is a hydration tool that converts body weight into a daily water target. Adults need about 30 to 35 ml of water per kilogram of body weight each day.',
      intentBadge: 'Hydration • 30–35 ml per kg of Body Weight'
    };
  }

  // 7E. Keto intent (P4): /calculators/keto/ — own title on the BMR/TDEE mode (TDEE is the keto starting point).
  if (cleanPath.includes('/calculators/keto')) {
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
      customMetaTitle: 'Keto Diet Calculator (Macros + Expected Weight Loss)',
      customMetaDescription:
        'Calculate keto diet macros and expected weight loss from your TDEE. A standard keto split is about 70% fat, 25% protein, and 5% carbs.',
      customHeroTitle: 'Keto Diet Calculator',
      customHeroIntro:
        'A keto diet calculator is a macro tool that converts your daily calories into a ketogenic split of about 70% fat, 25% protein, and 5% carbs. Enter your stats below to get your TDEE and your expected monthly loss.',
      intentBadge: 'Keto Macros • 70% Fat / 25% Protein / 5% Carbs'
    };
  }

  // 8. Restaurant Nutrition Intent (McDonald's, Subway & Five Guys)
  // 8A. Five Guys intent (P5): /restaurants/five-guys/ — own brand in the restaurant tool.
  if (cleanPath.includes('/restaurants/five-guys') || cleanPath.includes('five-guys')) {
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: normalizedCanonical,
      toolMode: 'subway',
      clinicalFocus: 'standard',
      restaurantBrand: 'five-guys',
      defaultWeightUnit,
      defaultBabyUnit,
      customMetaTitle: 'Five Guys Calorie & Nutrition Calculator (Burgers & Fries)',
      customMetaDescription:
        'Calculate total calories for Five Guys burgers and fries. Build your burger and fries below from official Five Guys nutrition values.',
      customHeroTitle: 'Five Guys Calorie & Nutrition Calculator',
      customHeroIntro:
        'Build your Five Guys burger and fries below to calculate total calories and see how the meal fits your daily weight loss calorie target.',
      intentBadge: 'Five Guys Meal Builder • Burgers & Fries'
    };
  }

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

  // 8B. Authors & Medical Reviewer (Ahrefs fix 2026-11-11 — explicit self-canonical + titles)
  if (cleanPath.includes('/authors/dr-rekha-kumar')) {
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
      customMetaTitle: 'Dr. Rekha Kumar, M.D., M.S. | Lead Medical Reviewer & Obesity Medicine Specialist',
      customMetaDescription:
        'Medical credentials, clinical publications, and editorial review standards for Dr. Rekha Kumar, Board-Certified Endocrinologist and Associate Professor of Clinical Medicine at Weill Cornell Medicine.',
      customHeroTitle: 'Dr. Rekha Kumar, M.D., M.S. — Medical Reviewer',
      customHeroIntro:
        'Board-Certified Endocrinologist, Diplomate of the American Board of Obesity Medicine (ABOM), and Associate Professor of Clinical Medicine at Weill Cornell Medicine.',
      intentBadge: 'Lead Medical Reviewer • Weill Cornell Medicine'
    };
  }

  // 8C. Site Info & Legal Pages (Ahrefs fix 2026-11-11 — explicit self-canonical + titles)
  if (cleanPath === '/about' || cleanPath === '/about/') {
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
      customMetaTitle: 'About Us | Clinically Validated Weight Loss Calculators',
      customMetaDescription:
        'Learn about Weight Loss Percentage (weightlosspercentage.com), our clinical medical leadership, zero-data storage architecture, and mission to provide free, peer-reviewed health calculators.',
      customHeroTitle: 'About Weight Loss Percentage',
      customHeroIntro:
        'Free, peer-reviewed clinical health calculators for adults, parents, and healthcare professionals. 100% private in-browser calculations with zero tracking.',
      intentBadge: 'About Us • Clinical Leadership & Privacy'
    };
  }

  if (cleanPath === '/methodology' || cleanPath === '/methodology/') {
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
      customMetaTitle: 'Medical Review & Methodology | Editorial Standards',
      customMetaDescription:
        'Our editorial standards, clinical review process, and scientific formulas (Mifflin-St Jeor, AAP guidelines, NIH DPP benchmarks) behind every calculator on Weight Loss Percentage.',
      customHeroTitle: 'Medical Review & Methodology',
      customHeroIntro:
        'Every calculator is built on published medical formulas, validated against clinical guidelines, and reviewed for accuracy by board-certified physicians.',
      intentBadge: 'Editorial Standards • Peer-Reviewed Formulas'
    };
  }

  if (cleanPath === '/privacy-policy' || cleanPath === '/privacy-policy/') {
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
      customMetaTitle: 'Privacy Policy | 100% Private Client-Side Health Calculations',
      customMetaDescription:
        'Read our privacy policy and zero-data storage guarantee. All biometric calculations run 100% client-side in your local browser with no server logging or personal data collection.',
      customHeroTitle: 'Privacy Policy & Zero-Data Guarantee',
      customHeroIntro:
        'We believe personal health data belongs exclusively to you. Every calculation executes in your browser with no account required and no remote data storage.',
      intentBadge: 'Zero Data Storage • 100% Private In-Browser'
    };
  }

  if (cleanPath === '/terms-of-service' || cleanPath === '/terms-of-service/') {
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
      customMetaTitle: 'Terms of Service & Clinical Disclaimer | Weight Loss Percentage',
      customMetaDescription:
        'Terms of service and clinical disclaimer for Weight Loss Percentage. Our tools and content provide educational health estimates and do not replace professional medical advice.',
      customHeroTitle: 'Terms of Service & Clinical Disclaimer',
      customHeroIntro:
        'Terms governing use of Weight Loss Percentage calculators and educational guides. Always consult a qualified physician for individual medical guidance.',
      intentBadge: 'Terms of Service • Educational Health Use'
    };
  }

  if (cleanPath === '/contact' || cleanPath === '/contact/') {
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
      customMetaTitle: 'Contact Us | Editorial & Engineering Team | Weight Loss Percentage',
      customMetaDescription:
        'Contact the editorial, clinical, and development teams at Weight Loss Percentage with questions, formula citations, or feature feedback.',
      customHeroTitle: 'Contact Editorial & Technical Support',
      customHeroIntro:
        'Reach our medical review board, clinical editorial staff, or engineering team with inquiries, formula citations, or feedback.',
      intentBadge: 'Contact Us • Clinical & Engineering Teams'
    };
  }

  // 8D. Comparison & Glossary Hubs (Ahrefs fix 2026-11-11 — explicit titles; exact-match hubs only)
  if (cleanPath === '/compare' || cleanPath === '/compare/') {
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
      customMetaTitle: 'Compare Weight Loss Methods, Diets & Clinical Interventions',
      customMetaDescription:
        'Compare calorie deficit, fasting, bariatric surgery, keto, and GLP-1 medications side-by-side with verified clinical trial benchmarks and percentage loss projections.',
      customHeroTitle: 'Compare Weight Loss Methods & Medical Calculations',
      customHeroIntro:
        'Compare the biological mechanisms, expected percentage reduction, and clinical trial evidence across calorie deficits, intermittent fasting, bariatric surgery, and GLP-1 therapy.',
      intentBadge: 'Method Comparison • Evidence-Based Benchmarks'
    };
  }

  if (cleanPath === '/glossary' || cleanPath === '/glossary/') {
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
      customMetaTitle: 'Weight Loss & Clinical Health Glossary (Key Terms & Formulas)',
      customMetaDescription:
        'Definitions and clinical explanations of key weight loss and metabolic terms: BMR, TDEE, %EWL, %TBWL, calorie deficit, neonatal weight loss, and GLP-1 benchmarks.',
      customHeroTitle: 'Clinical Weight Loss & Metabolic Health Glossary',
      customHeroIntro:
        'Search clear definitions and clinical formulas for BMR, TDEE, %EWL, neonatal fluid loss thresholds, and metabolic terms.',
      intentBadge: 'Clinical Glossary • Medical Definitions & Formulas'
    };
  }

  // 8E. Taxonomy Categories (Ahrefs fix 2026-11-11 — explicit titles; exact-match hubs only)
  if (cleanPath === '/category/clinical-calculators' || cleanPath === '/category/clinical-calculators/') {
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
      customMetaTitle: 'Clinical Weight Loss Calculators & Medical Formulas',
      customMetaDescription:
        'Medically reviewed clinical calculators including newborn weight loss, bariatric %EWL, GLP-1 trial trajectories, and postpartum deficit planners.',
      customHeroTitle: 'Clinical Weight Loss Calculators',
      customHeroIntro:
        'Peer-reviewed clinical calculators developed for medical milestones, neonatal hydration tracking, bariatric recovery, and pharmacological weight management.',
      intentBadge: 'Clinical Calculators • Peer-Reviewed Formulas'
    };
  }

  if (cleanPath === '/category/nutrition-calculators' || cleanPath === '/category/nutrition-calculators/') {
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
      customMetaTitle: 'Nutrition & Restaurant Calorie Calculators',
      customMetaDescription:
        "Calculate calories, macros, and deficits for restaurant meals including Five Guys, McDonald's, and Subway alongside daily TDEE targets.",
      customHeroTitle: 'Nutrition & Meal Calorie Calculators',
      customHeroIntro:
        'Meal-building and calorie-tracking tools designed to help you calculate energy intake from whole foods and major restaurants into your daily deficit.',
      intentBadge: 'Nutrition & Macros • Meal Calorie Builders'
    };
  }

  if (cleanPath === '/category/guides' || cleanPath === '/category/guides/') {
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
      customMetaTitle: 'Weight Loss Guides, Formulas & Milestone Charts',
      customMetaDescription:
        'Evidence-based guides, mathematical formulas, and milestone charts covering healthy monthly weight loss rates, 5% clinical benefits, and deficit planning.',
      customHeroTitle: 'Clinical Reference Guides & Educational Articles',
      customHeroIntro:
        'In-depth reference guides on the mathematics of weight loss percentage, cardiometabolic health milestones, and sustainable fat loss timelines.',
      intentBadge: 'Educational Guides • Clinical Reference Standards'
    };
  }

  // 9A. Compare / glossary / category hub pages — default tool with self-canonical.
  // (Placed before the BMR branch so /compare/bmr-vs-tdee/ does not borrow the BMR title.)
  if (
    cleanPath.includes('/compare/') ||
    cleanPath.includes('/glossary/') ||
    cleanPath.includes('/category/')
  ) {
    return {
      locale,
      shouldRedirectToHome: false,
      redirectTarget: normalizedCanonical,
      canonicalPath: normalizedCanonical,
      toolMode: 'adult',
      clinicalFocus: 'standard',
      restaurantBrand: 'subway',
      defaultWeightUnit,
      defaultBabyUnit
    };
  }

  // 9B. TDEE — own title (was sharing the BMR title verbatim).
  if (cleanPath.includes('/calculators/tdee')) {
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
      customMetaTitle: 'TDEE Calculator — Total Daily Energy Expenditure (BMR × Activity)',
      customMetaDescription:
        'Calculate Total Daily Energy Expenditure (TDEE): your BMR multiplied by an activity factor. Use your TDEE to set a 300 to 500 kcal daily deficit.',
      customHeroTitle: 'TDEE Calculator — Total Daily Energy Expenditure',
      customHeroIntro:
        'A TDEE calculator is an energy tool that multiplies your Basal Metabolic Rate (BMR) by an activity factor to estimate the calories you burn in a full day.',
      intentBadge: 'TDEE • BMR × Activity Factor'
    };
  }

  if (cleanPath.includes('/calculators/walking')) {
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
      customMetaTitle: 'Walking Calorie & Weight Loss Calculator (Speed, Incline & Distance)',
      customMetaDescription:
        'Calculate calories burned walking based on body weight, pace, incline, and duration. Track progress toward your weekly deficit and weight loss goal.',
      customHeroTitle: 'Walking Calorie & Weight Loss Calculator',
      customHeroIntro:
        'Calculate calories burned walking by entering your body weight, walking pace, and duration. See your net caloric expenditure and weekly progress below.',
      intentBadge: 'Walking Calories • MET Expenditure & Deficit Tracker',
      scrollSectionId: 'walking'
    };
  }

  if (cleanPath.includes('/calculators/running')) {
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
      customMetaTitle: 'Running Calorie & Weight Loss Calculator (Pace, Distance & Burn)',
      customMetaDescription:
        'Calculate running calories burned by pace, distance, and body weight. Project net caloric deficit and weekly weight loss timeline.',
      customHeroTitle: 'Running Calorie & Weight Loss Calculator',
      customHeroIntro:
        'Calculate calories burned running across different speeds and distances to determine your net caloric deficit and weekly weight loss progress.',
      intentBadge: 'Running Calories • Pace & Distance Caloric Burn',
      scrollSectionId: 'running'
    };
  }

  if (cleanPath.includes('/calculators/cycling')) {
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
      customMetaTitle: 'Cycling Calorie & Weight Loss Calculator (Speed, Power & Duration)',
      customMetaDescription:
        'Calculate cycling calories burned by speed, body weight, and duration. Convert your outdoor rides or stationary cycling into net fat loss.',
      customHeroTitle: 'Cycling Calorie & Weight Loss Calculator',
      customHeroIntro:
        'Calculate calories burned cycling indoors or outdoors based on speed and duration. Estimate your weekly deficit and body fat reduction.',
      intentBadge: 'Cycling Calories • Speed & Power Energy Expenditure',
      scrollSectionId: 'cycling'
    };
  }

  if (cleanPath.includes('/calculators/rowing')) {
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
      customMetaTitle: 'Rowing Machine Calorie & Weight Loss Calculator (Split & Intensity)',
      customMetaDescription:
        'Calculate rowing machine calories burned by split pace, intensity, and duration. See full-body energy burn and weight loss impact.',
      customHeroTitle: 'Rowing Machine Calorie & Weight Loss Calculator',
      customHeroIntro:
        'Calculate rowing calories burned per session based on stroke rate and intensity to project your weekly deficit and weight loss trajectory.',
      intentBadge: 'Rowing Calories • Full-Body Ergometer Burn',
      scrollSectionId: 'rowing'
    };
  }

  // 9D. BMR / Calorie Deficit / 12-Week Forecast Calculators
  if (
    cleanPath.includes('/bmr') ||
    cleanPath.includes('calorie-deficit') ||
    cleanPath.includes('/calculators/calorie')
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

  // 9E. High-impression blog posts — own titles (were sharing one generic blog title).
  if (cleanPath.includes('/blog/healthy-weight-loss-per-month')) {
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
      customMetaTitle: 'How Much Weight Can You Lose in a Month? Healthy Pace Guide',
      customMetaDescription:
        'A healthy pace is 4 to 8 pounds per month, or 1 to 2 pounds per week. See what a 500 kcal daily deficit loses in a month and how to project your timeline.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/5-percent-weight-loss')) {
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
      customMetaTitle: '5% Weight Loss: What It Means and How to Calculate It',
      customMetaDescription:
        'A 5% weight loss is the first clinical milestone doctors track for blood pressure, blood sugar, and joint health. Learn the formula and find 5% of your weight.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/how-to-calculate-weight-loss-percentage')) {
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
      customMetaTitle: 'How to Calculate Weight Loss Percentage (Formula + Examples)',
      customMetaDescription:
        'Step-by-step weight loss percentage formula ((Start - Current) ÷ Start) × 100, with worked examples in pounds and kilograms.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  // 9E. Individual Blog Post Metadata (17 Slugs)
  if (cleanPath.includes('/blog/weight-loss-formulas-explained')) {
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
      customMetaTitle: 'Weight Loss Formulas Explained: Percentage, BMR & Calorie Deficit',
      customMetaDescription:
        'The three formulas that matter for weight loss: percentage lost ((Start - Current) ÷ Start) × 100, BMR (Mifflin-St Jeor), and daily calorie deficit.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/signs-body-burning-fat')) {
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
      customMetaTitle: "Signs Your Body Is Burning Fat (and How to Tell It's Working)",
      customMetaDescription:
        'How to tell your body is burning fat: a steady downward scale trend, looser clothes, a shrinking waist measurement, and more stable energy.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/weight-tracking-guide')) {
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
      customMetaTitle: 'Weight Tracking Guide: How to Weigh Yourself and Read the Trend',
      customMetaDescription:
        'Weigh yourself the same way each morning, record it daily, and read the weekly average — not a single day — to see real fat loss.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/how-to-calculate-body-fat')) {
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
      customMetaTitle: 'How to Calculate Body Fat Percentage (Methods + Formula)',
      customMetaDescription:
        'Body fat percentage from measurements, scales, and calipers: the formulas, what each method actually measures, and which is most reliable.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/exercise-for-weight-loss')) {
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
      customMetaTitle: 'Exercise for Weight Loss: What Burns the Most Fat',
      customMetaDescription:
        'Walking, strength training, and cardio compared for weight loss: how many calories each burns and how to combine them for steady fat loss.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/biggest-loser-formula')) {
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
      customMetaTitle: "Biggest Loser Formula: How the Show's Weight Loss Percentages Work",
      customMetaDescription:
        "How The Biggest Loser calculates weight loss percentage: ((Start - Current) ÷ Start) × 100, and why the show's weekly numbers look so extreme.",
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/weight-loss-percentage-at-300-to-400-lbs')) {
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
      customMetaTitle: 'Weight Loss Percentage at 300 to 400 lbs: Chart & Examples',
      customMetaDescription:
        'What 5%, 10%, and 20% weight loss looks like from 300 to 400 lbs: pounds lost at each milestone, with the percentage formula worked out.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/weight-loss-percentage-at-170-to-230-lbs')) {
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
      customMetaTitle: 'Weight Loss Percentage at 170 to 230 lbs: Chart & Examples',
      customMetaDescription:
        'What 5%, 10%, and 20% weight loss looks like from 170 to 230 lbs: pounds lost at each milestone, with the percentage formula worked out.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/calculate-bmr-to-lose-weight')) {
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
      customMetaTitle: 'Calculate BMR to Lose Weight (Mifflin-St Jeor + Deficit)',
      customMetaDescription:
        'Find your BMR with the Mifflin-St Jeor equation, multiply by activity for TDEE, then subtract 500 kcal a day for about a pound a week.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/fat-loss-vs-weight-loss')) {
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
      customMetaTitle: 'Fat Loss vs Weight Loss: Two Different Numbers',
      customMetaDescription:
        'Fat loss and weight loss are not the same number: scale weight includes water and muscle, so track body fat percentage alongside the scale.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/calories-vs-weight-loss')) {
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
      customMetaTitle: 'Calories vs Weight Loss: How the Deficit Translates to Pounds',
      customMetaDescription:
        'One pound of fat is about 3,500 kcal: how a daily calorie deficit adds up to pounds lost per week, and why the math slows as you get lighter.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/walking-for-weight-loss')) {
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
      customMetaTitle: 'Walking for Weight Loss: Calories, Pace & Weekly Plan',
      customMetaDescription:
        'How many calories walking burns by body weight and pace, how many steps a day actually move the scale, and a simple weekly walking plan.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/anti-gravity-exercises-weight-loss')) {
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
      customMetaTitle: 'Anti-Gravity Exercises for Weight Loss: Low-Impact Ways to Move More',
      customMetaDescription:
        'Anti-gravity and low-impact exercise options for weight loss when joints or weight make regular exercise hard — and how they burn calories.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/weight-loss-percentage-at-230-to-300-lbs')) {
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
      customMetaTitle: 'Weight Loss Percentage at 230 to 300 lbs: Chart & Examples',
      customMetaDescription:
        'What 5%, 10%, and 20% weight loss looks like from 230 to 300 lbs: pounds lost at each milestone, with the percentage formula worked out.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/weight-loss-percentage-at-130-to-170-lbs')) {
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
      customMetaTitle: 'Weight Loss Percentage at 130 to 170 lbs: Chart & Examples',
      customMetaDescription:
        'What 5%, 10%, and 20% weight loss looks like from 130 to 170 lbs: pounds lost at each milestone, with the percentage formula worked out.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/keto-diet-weight-loss')) {
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
      customMetaTitle: 'Keto Diet Weight Loss: Macros, Timeline & What to Expect',
      customMetaDescription:
        'What to expect from keto weight loss: the fast early water-weight drop, then steady fat loss — plus the macros that define a ketogenic diet.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
    };
  }

  if (cleanPath.includes('/blog/weight-loss-percentage-by-starting-weight')) {
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
      customMetaTitle: 'Weight Loss Percentage by Starting Weight: Chart & Calculator',
      customMetaDescription:
        'What 5% and 10% weight loss means at your starting weight: pounds lost at each milestone, from 130 to 400 lbs, with the percentage formula.',
      intentBadge: 'Interactive Calculator + Clinical Reference Guide'
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

  // P6 & P8: Distinct Hub Title for /calculators/ directory root
  if (
    cleanPath === '/calculators' ||
    cleanPath === '/calculators/' ||
    cleanPath === `${localePrefix}/calculators` ||
    cleanPath === `${localePrefix}/calculators/`
  ) {
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
      customMetaTitle: 'Weight Loss & Clinical Health Calculators Hub (All Tools)',
      customMetaDescription:
        'Explore all free, medically reviewed weight loss calculators: percentage lost, calorie deficit, BMR, TDEE, newborn, fasting, bariatric, and GLP-1 tracking tools.',
      customHeroTitle: 'Weight Loss & Clinical Health Calculators Hub',
      customHeroIntro:
        'Browse all evidence-based calculators, from body weight percentage loss and BMR projections to newborn feeding tracking and GLP-1 clinical benchmarks.',
      intentBadge: 'Evidence-Based Health Calculators Hub • 100% Free & Medically Reviewed'
    };
  }

  // 10. Default Homepage / Regional Adult Weight Loss Percentage Calculator
  return {
    locale,
    shouldRedirectToHome: false,
    redirectTarget: normalizedCanonical,
    canonicalPath: isSelfCanonicalPath(cleanPath) ? normalizedCanonical : localeHome,
    toolMode: 'adult',
    clinicalFocus: 'standard',
    restaurantBrand: 'subway',
    defaultWeightUnit,
    defaultBabyUnit
  };
}

function isSelfCanonicalPath(cleanPath: string): boolean {
  return (
    cleanPath.includes('/calculators/') ||
    cleanPath.includes('/restaurants/') ||
    cleanPath.includes('/compare/') ||
    cleanPath.includes('/glossary/') ||
    cleanPath.includes('/category/')
  );
}
