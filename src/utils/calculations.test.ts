import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertToLbs,
  convertFromLbs,
  lbsToStonesAndPounds,
  stonesAndPoundsToLbs,
  calculateBmi,
  getBmiCategory,
  calculateWeightLossResult,
  getMilestoneProgress
} from './calculations';
import { ALL_SEARCHABLE_TOOLS, searchTools } from './toolSearch';
import {
  isProgrammaticRedirectPath,
  isPeptideOrReconstitutionRedirectPath,
  resolveSearchIntentFromPath
} from './seoIntentRouter';
import { EXTENDED_LOCALE_PARITY } from '../data/multilingualParity';
import { SILOS_DATA } from '../data/keywordMatrix';

test('unit conversions between lbs, kg, and stones work accurately', () => {
  assert.equal(Math.round(convertToLbs(100, 'kg')), 220);
  assert.equal(convertToLbs(5, 'st', 10), 145);
  assert.equal(convertFromLbs(220.462262185, 'kg'), 100);
  assert.deepEqual(lbsToStonesAndPounds(145), { stones: 10, pounds: 5 });
  assert.equal(stonesAndPoundsToLbs(10, 5), 145);
});

test('BMI calculation and category classification work properly', () => {
  const bmi = calculateBmi(70, 1.75);
  assert.equal(bmi, 22.9);
  assert.equal(getBmiCategory(bmi).label, 'Normal weight');
  assert.equal(getBmiCategory(17.2).label, 'Underweight');
  assert.equal(getBmiCategory(28.4).label, 'Overweight');
  assert.equal(getBmiCategory(32.1).label, 'Obese (Class I)');
});

test('weight loss percentage calculation produces clinical accuracy', () => {
  const res = calculateWeightLossResult(
    215,
    193.5,
    175,
    'lbs',
    '2026-08-01',
    '2026-11-01',
    { unit: 'ft_in', feet: 5, inches: 10 }
  );
  assert.ok(res);
  assert.equal(res.isLoss, true);
  assert.equal(res.weightChange, 21.5);
  assert.equal(res.percentChange, 10);
  assert.equal(res.remainingToGoal, 18.5);
  assert.equal(res.percentGoalAchieved, 53.8);
});

test('clinical milestone progress flags 5% and 10% landmarks accurately', () => {
  const milestones = getMilestoneProgress(200, 180, 'lbs');
  assert.equal(milestones.length, 4);
  assert.equal(milestones[0].percentage, 5);
  assert.equal(milestones[0].isAchieved, true);
  assert.equal(milestones[1].percentage, 10);
  assert.equal(milestones[1].isAchieved, true);
  assert.equal(milestones[2].percentage, 15);
  assert.equal(milestones[2].isAchieved, false);
});

test('toolSearch indexes all 38 calculators and guides and ranks Bing keyword clusters accurately', () => {
  assert.equal(ALL_SEARCHABLE_TOOLS.length, 38);
  assert.equal(searchTools('').length, 38);

  const newbornMatches = searchTools('newborn');
  assert.ok(newbornMatches.length >= 2);
  assert.equal(newbornMatches[0].id, 'newborn');

  const fastingMatches = searchTools('water fast weight loss calculator');
  assert.ok(fastingMatches.length >= 1);
  assert.equal(fastingMatches[0].id, 'water-fasting');
  assert.equal(fastingMatches[0].clinicalFocus, 'fasting');

  const glp1Matches = searchTools('ozempic weight loss calculator');
  assert.ok(glp1Matches.length >= 1);
  assert.equal(glp1Matches[0].id, 'glp1-calculator');
  assert.equal(glp1Matches[0].clinicalFocus, 'glp1');

  const sleeveMatches = searchTools('duodenal switch weight loss calculator');
  assert.ok(sleeveMatches.some((item) => item.id === 'gastric-bypass'));

  const ketoMatches = searchTools('keto');
  assert.equal(ketoMatches[0].id, 'keto');

  const fiveGuysMatches = searchTools('five guys calorie calculator');
  assert.ok(fiveGuysMatches.length >= 1);
  assert.equal(fiveGuysMatches[0].id, 'five-guys');
  assert.equal(fiveGuysMatches[0].restaurantBrand, 'five-guys');

  const runningMatches = searchTools('running calorie calculator');
  assert.ok(runningMatches.length >= 1);
  assert.equal(runningMatches[0].id, 'running');

  const paceMatches = searchTools('pace calculator');
  assert.ok(paceMatches.length >= 1);
  assert.equal(paceMatches[0].id, 'how-much-weight-can-i-lose-in-a-month');
});

test('programmatic URLs and unapproved peptide reconstitution URLs are flagged for safe canonical redirects', () => {
  assert.equal(isProgrammaticRedirectPath('/calculators/weight-loss/from-190-to-150/'), true);
  assert.equal(isProgrammaticRedirectPath('/calculators/bmi/height-weight/5-8/270/'), true);
  assert.equal(isProgrammaticRedirectPath('/weight-loss-5-percent-180-lbs.html'), true);
  assert.equal(isProgrammaticRedirectPath('/calculators/newborn-weight-loss/'), false);

  assert.equal(isPeptideOrReconstitutionRedirectPath('/calculators/retatrutide-weight-loss/'), true);
  assert.equal(isPeptideOrReconstitutionRedirectPath('/calculators/peptide-reconstitution/'), true);
  assert.equal(isPeptideOrReconstitutionRedirectPath('/calculators/glp1-weight-loss/'), false);

  const progUs = resolveSearchIntentFromPath('/calculators/weight-loss/from-250-to-200/');
  assert.equal(progUs.shouldRedirectToHome, true);
  assert.equal(progUs.redirectTarget, '/');

  const peptideRedirect = resolveSearchIntentFromPath('/calculators/retatrutide-weight-loss/');
  assert.equal(peptideRedirect.shouldRedirectToHome, true);
  assert.equal(peptideRedirect.redirectTarget, '/calculators/glp1-weight-loss/');
  assert.equal(peptideRedirect.clinicalFocus, 'glp1');
});

test('search intent router satisfies Newborn, Water Fasting/OMAD, Bariatric, GLP-1, Losertown BMR, and McDonald’s queries', () => {
  const newbornUs = resolveSearchIntentFromPath('/calculators/newborn-weight-loss/');
  assert.equal(newbornUs.shouldRedirectToHome, false);
  assert.equal(newbornUs.toolMode, 'newborn');
  assert.equal(newbornUs.canonicalPath, '/calculators/newborn-weight-loss/');

  const waterFast = resolveSearchIntentFromPath('/calculators/water-fasting-weight-loss/');
  assert.equal(waterFast.shouldRedirectToHome, false);
  assert.equal(waterFast.toolMode, 'adult');
  assert.equal(waterFast.clinicalFocus, 'fasting');
  assert.equal(waterFast.canonicalPath, '/calculators/water-fasting-weight-loss/');

  const omad = resolveSearchIntentFromPath('/calculators/omad-weight-loss/');
  assert.equal(omad.toolMode, 'adult');
  assert.equal(omad.clinicalFocus, 'fasting');

  const bariatric = resolveSearchIntentFromPath('/calculators/bariatric-surgery-weight-loss/');
  assert.equal(bariatric.toolMode, 'adult');
  assert.equal(bariatric.clinicalFocus, 'bariatric');
  assert.equal(bariatric.canonicalPath, '/calculators/bariatric-surgery-weight-loss/');

  const glp1 = resolveSearchIntentFromPath('/calculators/glp1-weight-loss/');
  assert.equal(glp1.toolMode, 'adult');
  assert.equal(glp1.clinicalFocus, 'glp1');

  const losertown = resolveSearchIntentFromPath('/calculators/losertown-weight-loss/');
  assert.equal(losertown.toolMode, 'bmr');

  const mcdZh = resolveSearchIntentFromPath('/zh/restaurants/mcdonalds/');
  assert.equal(mcdZh.locale, 'zh');
  assert.equal(mcdZh.toolMode, 'subway');
  assert.equal(mcdZh.restaurantBrand, 'mcdonalds');
  assert.equal(mcdZh.canonicalPath, '/zh/restaurants/mcdonalds/');

  const auDeficit = resolveSearchIntentFromPath('/au/calculators/calorie-deficit/');
  assert.equal(auDeficit.locale, 'au');
  assert.equal(auDeficit.toolMode, 'bmr');
  assert.equal(auDeficit.defaultWeightUnit, 'kg');
});

test('Triple-to-Triple multilingual parity covers all 8 locales and all 26 directory hub titles', () => {
  const requiredLocales = ['en', 'ca', 'uk', 'au', 'de', 'it', 'ru', 'zh'];
  for (const loc of requiredLocales) {
    const parity = EXTENDED_LOCALE_PARITY[loc];
    assert.ok(parity, `Missing parity entry for locale: ${loc}`);
    assert.ok(parity.focusFasting.length > 0);
    assert.ok(parity.focusBariatric.length > 0);
    assert.ok(parity.focusGlp1.length > 0);
    assert.ok(parity.ewlDesc.length > 0);
    assert.equal(parity.howToSteps.length, 3);
    for (const silo of SILOS_DATA) {
      assert.ok(
        parity.siloHubTitles[silo.id] && parity.siloHubTitles[silo.id].length > 0,
        `Missing localized silo title for ${silo.id} in locale ${loc}`
      );
    }
  }
});

test('GSC 28-day topical-map optimizations P1-P6 routes resolve accurately', () => {
  // P1: how much weight can I lose in a month
  const p1 = resolveSearchIntentFromPath('/calculators/how-much-weight-can-i-lose-in-a-month/');
  assert.equal(p1.toolMode, 'bmr');
  assert.equal(p1.customMetaTitle, 'How Much Weight Can I Lose in a Month Calculator (Safe Pace + Timeline)');
  assert.equal(p1.canonicalPath, '/calculators/how-much-weight-can-i-lose-in-a-month/');
  assert.equal(p1.intentBadge, 'Safe Pace • 1–2 lbs per Week • 500 kcal/day ≈ 1 lb/week');

  // P2: fat loss
  const p2 = resolveSearchIntentFromPath('/calculators/fat-loss/');
  assert.equal(p2.toolMode, 'adult');
  assert.equal(p2.canonicalPath, '/calculators/fat-loss/');
  assert.equal(p2.customHeroTitle, 'Fat Loss Percentage Calculator');

  // P3: water intake
  const p3 = resolveSearchIntentFromPath('/calculators/water-intake/');
  assert.equal(p3.toolMode, 'adult');
  assert.equal(p3.canonicalPath, '/calculators/water-intake/');
  assert.equal(p3.intentBadge, 'Hydration • 30–35 ml per kg of Body Weight');

  // P4: keto
  const p4 = resolveSearchIntentFromPath('/calculators/keto/');
  assert.equal(p4.toolMode, 'bmr');
  assert.equal(p4.customMetaTitle, 'Keto Diet Calculator (Macros + Expected Weight Loss)');

  // P5: five guys
  const p5 = resolveSearchIntentFromPath('/restaurants/five-guys/');
  assert.equal(p5.toolMode, 'subway');
  assert.equal(p5.restaurantBrand, 'five-guys');
  assert.equal(p5.customMetaTitle, 'Five Guys Calorie & Nutrition Calculator (Burgers & Fries)');

  // P6: baby title split vs newborn
  const baby = resolveSearchIntentFromPath('/calculators/baby-weight-loss/');
  const newborn = resolveSearchIntentFromPath('/calculators/newborn-weight-loss/');
  assert.equal(baby.customMetaTitle, 'Baby Weight Loss Calculator (lbs/oz & Grams)');
  assert.equal(baby.customHeroTitle, 'Baby Weight Loss Calculator');
  assert.equal(newborn.customHeroTitle, 'Newborn & Infant Weight Loss Percentage Calculator');

  // P6: TDEE specific title
  const tdee = resolveSearchIntentFromPath('/calculators/tdee/');
  assert.equal(tdee.customMetaTitle, 'TDEE Calculator — Total Daily Energy Expenditure (BMR × Activity)');

  // P6: Activity titles
  const walking = resolveSearchIntentFromPath('/calculators/walking/');
  assert.equal(walking.customMetaTitle, 'Walking Calorie & Weight Loss Calculator (Speed, Incline & Distance)');

  // P6 & P8: Distinct calculators hub title
  const hub = resolveSearchIntentFromPath('/calculators/');
  assert.equal(hub.customMetaTitle, 'Weight Loss & Clinical Health Calculators Hub (All Tools)');
});



