import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  Baby,
  Scale,
  Flame,
  Utensils,
  Award,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Minus,
  Plus,
  Printer
} from 'lucide-react';

import { LOCALE_TRANSLATIONS } from '../data/localeStrings';
import { EXTENDED_LOCALE_PARITY } from '../data/multilingualParity';
import { ClinicalFocus, RestaurantBrand } from '../utils/seoIntentRouter';
import { lbsToStonesAndPounds, LBS_PER_KG } from '../utils/calculations';
import { ScaleMilestoneRule } from './ScaleMilestoneRule';

export type ToolMode = 'adult' | 'newborn' | 'bmr' | 'subway';

interface HeroToolBoxProps {
  externalMode?: ToolMode;
  onModeChange?: (m: ToolMode) => void;
  locale?: string;
  clinicalFocus?: ClinicalFocus;
  onClinicalFocusChange?: (f: ClinicalFocus) => void;
  restaurantBrand?: RestaurantBrand;
  onRestaurantBrandChange?: (b: RestaurantBrand) => void;
  defaultWeightUnit?: 'lbs' | 'kg';
  defaultBabyUnit?: 'lbs_oz' | 'grams';
}

export const HeroToolBox: React.FC<HeroToolBoxProps> = ({
  externalMode,
  onModeChange,
  locale = 'en',
  clinicalFocus = 'standard',
  onClinicalFocusChange,
  restaurantBrand = 'subway',
  onRestaurantBrandChange,
  defaultWeightUnit = 'lbs',
  defaultBabyUnit = 'lbs_oz'
}) => {
  const t = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS.en;
  const p = EXTENDED_LOCALE_PARITY[locale] || EXTENDED_LOCALE_PARITY.en;
  const [internalMode, setInternalMode] = useState<ToolMode>('adult');
  const mode = externalMode ?? internalMode;

  const setMode = (m: ToolMode) => {
    setInternalMode(m);
    if (onModeChange) onModeChange(m);
  };

  const [unit, setUnit] = useState<'lbs' | 'kg'>(defaultWeightUnit);
  const [activeFocus, setActiveFocus] = useState<ClinicalFocus>(clinicalFocus);
  const [activeBrand, setActiveBrand] = useState<RestaurantBrand>(restaurantBrand);

  // Adult inputs
  const [adultStart, setAdultStart] = useState<string>('215');
  const [adultCurrent, setAdultCurrent] = useState<string>('193.5');
  const [adultGoal, setAdultGoal] = useState<string>('175');

  // Newborn inputs
  const [babyUnit, setBabyUnit] = useState<'lbs_oz' | 'grams'>(defaultBabyUnit);
  const [birthLbs, setBirthLbs] = useState<string>('8');
  const [birthOz, setBirthOz] = useState<string>('4');
  const [currentLbs, setCurrentLbs] = useState<string>('7');
  const [currentOz, setCurrentOz] = useState<string>('10');
  const [birthGrams, setBirthGrams] = useState<string>('3750');
  const [currentGrams, setCurrentGrams] = useState<string>('3450');
  const [babyHoursOld, setBabyHoursOld] = useState<string>('48');

  // BMR & Calorie inputs
  const [age, setAge] = useState<string>('34');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [heightInches, setHeightInches] = useState<string>('66');
  const [activityFactor, setActivityFactor] = useState<string>('1.375');

  // Fast food / Subway & McDonald's macro quick inputs
  const [subwaySize, setSubwaySize] = useState<'six_inch' | 'footlong'>('six_inch');
  const [subwayBread, setSubwayBread] = useState<number>(200);
  const [subwayMeat, setSubwayMeat] = useState<number>(180);
  const [subwayCheese, setSubwayCheese] = useState<number>(50);
  const [subwaySauce, setSubwaySauce] = useState<number>(100);

  // McDonald's meal builder inputs
  const [mcdMain, setMcdMain] = useState<number>(590);
  const [mcdFries, setMcdFries] = useState<number>(320);
  const [mcdDrink, setMcdDrink] = useState<number>(0);
  const [mcdSauce, setMcdSauce] = useState<number>(45);

  // Five Guys meal builder inputs
  const [fiveGuysBurger, setFiveGuysBurger] = useState<number>(840);
  const [fiveGuysFries, setFiveGuysFries] = useState<number>(953);
  const [fiveGuysDrink, setFiveGuysDrink] = useState<number>(0);

  const [copied, setCopied] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);

  // Sub-selectors for Clinical Focus & BMR Forecast
  const [fastingProtocol, setFastingProtocol] = useState<'24h' | '48h' | '72h' | '5d' | '7d' | 'omad30' | 'if16_8'>('72h');
  const [bariatricProcedure, setBariatricProcedure] = useState<'vsg' | 'rny' | 'ds'>('vsg');
  const [glp1Medication, setGlp1Medication] = useState<'semaglutide' | 'tirzepatide' | 'retatrutide' | 'phentermine'>('semaglutide');
  const [lactationStatus, setLactationStatus] = useState<'exclusive' | 'combo' | 'none'>('exclusive');
  const [customDailyIntake, setCustomDailyIntake] = useState<string>('1550');

  useEffect(() => {
    setActiveFocus(clinicalFocus);
  }, [clinicalFocus]);

  useEffect(() => {
    setActiveBrand(restaurantBrand);
  }, [restaurantBrand]);

  useEffect(() => {
    setUnit(defaultWeightUnit);
  }, [defaultWeightUnit]);

  useEffect(() => {
    setBabyUnit(defaultBabyUnit);
  }, [defaultBabyUnit]);

  const handleFocusSelect = (f: ClinicalFocus) => {
    setActiveFocus(f);
    if (onClinicalFocusChange) onClinicalFocusChange(f);
  };

  const handleBrandSelect = (b: RestaurantBrand) => {
    setActiveBrand(b);
    if (onRestaurantBrandChange) onRestaurantBrandChange(b);
  };

  // Stepper helper for mobile touch convenience
  const stepValue = (
    currentStr: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    delta: number,
    min = 1
  ) => {
    const val = parseFloat(currentStr) || 0;
    const next = Math.max(min, +(val + delta).toFixed(1));
    setter(String(next));
  };

  // Adult calculation
  const sWeight = parseFloat(adultStart) || 0;
  const cWeight = parseFloat(adultCurrent) || 0;
  const gWeight = parseFloat(adultGoal) || 0;
  const adultLost = sWeight > 0 ? sWeight - cWeight : 0;
  const adultPct = sWeight > 0 ? +((adultLost / sWeight) * 100).toFixed(2) : 0;
  const isLoss = adultLost > 0;

  // Bariatric Excess Weight Loss (%EWL) using Goal/Ideal Weight
  const excessWeightTotal = gWeight > 0 && sWeight > gWeight ? sWeight - gWeight : sWeight * 0.35;
  const excessWeightLostPct =
    excessWeightTotal > 0 ? Math.max(0, Math.min(150, +((adultLost / excessWeightTotal) * 100).toFixed(1))) : 0;

  // UK / Imperial Stone & Pounds equivalent for lost weight and current weight
  const lostInLbs = unit === 'kg' ? Math.abs(adultLost) * LBS_PER_KG : Math.abs(adultLost);
  const currentInLbs = unit === 'kg' ? cWeight * LBS_PER_KG : cWeight;
  const lostStoneAndLbs = lbsToStonesAndPounds(lostInLbs);
  const currentStoneAndLbs = lbsToStonesAndPounds(currentInLbs);

  // Newborn calculation
  let newbornLossPct = 0;
  let newbornGramsLost = 0;
  let birthGramsTotal = 0;
  let currentGramsTotal = 0;

  if (babyUnit === 'lbs_oz') {
    const bTotalOz = (parseFloat(birthLbs) || 0) * 16 + (parseFloat(birthOz) || 0);
    const cTotalOz = (parseFloat(currentLbs) || 0) * 16 + (parseFloat(currentOz) || 0);
    birthGramsTotal = Math.round(bTotalOz * 28.3495);
    currentGramsTotal = Math.round(cTotalOz * 28.3495);
    if (bTotalOz > 0) {
      newbornLossPct = +(((bTotalOz - cTotalOz) / bTotalOz) * 100).toFixed(2);
      newbornGramsLost = birthGramsTotal - currentGramsTotal;
    }
  } else {
    birthGramsTotal = parseFloat(birthGrams) || 0;
    currentGramsTotal = parseFloat(currentGrams) || 0;
    if (birthGramsTotal > 0) {
      newbornLossPct = +(((birthGramsTotal - currentGramsTotal) / birthGramsTotal) * 100).toFixed(2);
      newbornGramsLost = birthGramsTotal - currentGramsTotal;
    }
  }

  // BMR calculation (Mifflin-St Jeor)
  const weightKg = unit === 'kg' ? cWeight : cWeight * 0.453592;
  const heightCm = (parseFloat(heightInches) || 66) * 2.54;
  const ageVal = parseFloat(age) || 30;
  let calculatedBmr = 0;
  if (gender === 'male') {
    calculatedBmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageVal + 5);
  } else {
    calculatedBmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageVal - 161);
  }
  const calculatedTdee = Math.round(calculatedBmr * (parseFloat(activityFactor) || 1.2));

  // Water Fasting & OMAD Metabolic Model (Glycogen + Bound Water vs True Adipose Oxidation)
  const kcalPerUnit = unit === 'kg' ? 7700 : 3500;
  const estimatedDailyBurn = sWeight > 0 ? Math.max(1400, Math.round((unit === 'kg' ? sWeight * 24 : sWeight * 11) * 1.2)) : calculatedTdee;
  const fastingConfig: Record<
    typeof fastingProtocol,
    { label: string; days: number; dailyDeficit: number; waterDropLbs: number }
  > = {
    '24h': { label: '24-Hour Water Fast (1 Day)', days: 1, dailyDeficit: estimatedDailyBurn, waterDropLbs: 2.2 },
    '48h': { label: '48-Hour Water Fast (2 Days)', days: 2, dailyDeficit: estimatedDailyBurn, waterDropLbs: 3.8 },
    '72h': { label: '72-Hour Water Fast (3 Days)', days: 3, dailyDeficit: estimatedDailyBurn, waterDropLbs: 5.0 },
    '5d': { label: '5-Day Extended Water Fast', days: 5, dailyDeficit: estimatedDailyBurn, waterDropLbs: 5.8 },
    '7d': { label: '7-Day Extended Water Fast', days: 7, dailyDeficit: estimatedDailyBurn, waterDropLbs: 6.4 },
    omad30: { label: 'OMAD 23:1 Protocol (30 Days)', days: 30, dailyDeficit: 750, waterDropLbs: 2.5 },
    if16_8: { label: '16:8 Intermittent Fasting (30 Days)', days: 30, dailyDeficit: 500, waterDropLbs: 1.8 }
  };
  const activeFasting = fastingConfig[fastingProtocol];
  const fastingTrueFatLoss = +((activeFasting.dailyDeficit * activeFasting.days) / kcalPerUnit).toFixed(1);
  const fastingWaterLoss = +(unit === 'kg' ? activeFasting.waterDropLbs / LBS_PER_KG : activeFasting.waterDropLbs).toFixed(1);
  const fastingTotalDrop = +(fastingTrueFatLoss + fastingWaterLoss).toFixed(1);
  const fastingNetPct = sWeight > 0 ? +((fastingTrueFatLoss / sWeight) * 100).toFixed(2) : 0;

  // Bariatric Procedure Timeline Model (Months 1, 3, 6, 12, 18 %EWL curves)
  const bariatricProcedures: Record<
    typeof bariatricProcedure,
    { name: string; peakTbwlPct: number; ewlMonths: [number, number, number, number, number] }
  > = {
    vsg: { name: 'Vertical Sleeve Gastrectomy (VSG)', peakTbwlPct: 25, ewlMonths: [18, 35, 50, 62, 65] },
    rny: { name: 'Roux-en-Y Gastric Bypass (RNY)', peakTbwlPct: 30, ewlMonths: [20, 40, 58, 70, 74] },
    ds: { name: 'Duodenal Switch (BPD/DS)', peakTbwlPct: 38, ewlMonths: [22, 45, 65, 78, 82] }
  };
  const activeBariatric = bariatricProcedures[bariatricProcedure];

  // GLP-1 & Clinical Trial Benchmark Model
  const glp1Medications: Record<
    typeof glp1Medication,
    { name: string; trialName: string; meanTbwlPct: number; titrationSchedule: string }
  > = {
    semaglutide: {
      name: 'Semaglutide (Ozempic® / Wegovy®)',
      trialName: 'STEP-1 NEJM Trial (68 Weeks)',
      meanTbwlPct: 14.9,
      titrationSchedule: '0.25 mg (Wks 1–4) → 0.5 mg (Wks 5–8) → 1.0 mg (Wks 9–12) → 1.7 mg (Wks 13–16) → 2.4 mg Maintenance'
    },
    tirzepatide: {
      name: 'Tirzepatide (Mounjaro® / Zepbound®)',
      trialName: 'SURMOUNT-1 NEJM Trial (72 Weeks)',
      meanTbwlPct: 20.9,
      titrationSchedule: '2.5 mg (Wks 1–4) → 5.0 mg (Wks 5–8) → 7.5 mg (Wks 9–12) → 10–15 mg Maintenance'
    },
    retatrutide: {
      name: 'Retatrutide (Phase 2 Triple-Agonist)',
      trialName: 'NEJM Phase 2 Trial Benchmark (48 Weeks)',
      meanTbwlPct: 24.2,
      titrationSchedule: 'Investigational Clinical Trial Protocol Only (Not FDA-approved for retail compounding)'
    },
    phentermine: {
      name: 'Phentermine / Tesamorelin Reference',
      trialName: 'Short-Term Adrenergic / Metabolic Benchmark (12–24 Weeks)',
      meanTbwlPct: 7.5,
      titrationSchedule: '15 mg – 37.5 mg oral daily (Physician-monitored short-term protocol)'
    }
  };
  const activeGlp1 = glp1Medications[glp1Medication];

  // Postpartum & Breastfeeding Lactation Adder
  const lactationAdders: Record<typeof lactationStatus, { label: string; kcalAdder: number; minFloor: number }> = {
    exclusive: { label: 'Exclusive Breastfeeding (+450 kcal/day milk synthesis)', kcalAdder: 450, minFloor: 1800 },
    combo: { label: 'Combination Breast + Formula (+250 kcal/day)', kcalAdder: 250, minFloor: 1650 },
    none: { label: 'Non-Lactating / Formula Feeding (+0 kcal/day)', kcalAdder: 0, minFloor: 1350 }
  };
  const activeLactation = lactationAdders[lactationStatus];
  const postpartumSafeDailyKcal = Math.max(activeLactation.minFloor, calculatedTdee + activeLactation.kcalAdder - 500);

  // Losertown-style 12-Week Forecast (for BMR/TDEE mode)
  const intakeVal = parseFloat(customDailyIntake) || Math.max(1200, calculatedTdee - 500);
  const dailyNetDeficit = calculatedTdee - intakeVal;
  const weeklyWeightChange = +(dailyNetDeficit * 7 / kcalPerUnit).toFixed(2);

  // Keto Macro Grams (70% Fat / 9 kcal/g, 25% Protein / 4 kcal/g, 5% Net Carbs / 4 kcal/g)
  const isKeto = typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('keto');
  const ketoFatG = Math.round((calculatedTdee * 0.70) / 9);
  const ketoProteinG = Math.round((calculatedTdee * 0.25) / 4);
  const ketoCarbsG = Math.round((calculatedTdee * 0.05) / 4);

  // Restaurant (Subway, McDonald's & Five Guys) calculation
  const multiplier = subwaySize === 'footlong' ? 2 : 1;
  const subwayTotalCalories = (subwayBread + subwayMeat + subwayCheese + subwaySauce) * multiplier;
  const mcdTotalCalories = mcdMain + mcdFries + mcdDrink + mcdSauce;
  const fiveGuysTotalCalories = fiveGuysBurger + fiveGuysFries + fiveGuysDrink;
  const activeRestaurantCalories =
    activeBrand === 'five-guys'
      ? fiveGuysTotalCalories
      : activeBrand === 'mcdonalds'
      ? mcdTotalCalories
      : subwayTotalCalories;

  const triggerCelebration = async () => {
    const { default: confetti } = await import('canvas-confetti');
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.55 },
      colors: ['#c2410c', '#ea580c', '#78716c', '#a8a29e', '#1c1917']
    });
  };

  const downloadResult = async () => {
    const { jsPDF } = await import('jspdf');
    const dateStr = new Date().toISOString().split('T')[0];
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Top Brand Header Banner
    doc.setFillColor(28, 25, 23);
    doc.rect(0, 0, 210, 34, 'F');

    // Brand Badge [%]
    doc.setFillColor(194, 65, 12);
    doc.roundedRect(14, 8, 12, 12, 2.5, 2.5, 'F');
    doc.setTextColor(250, 249, 247);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('%', 20, 16, { align: 'center' });

    // Brand Name & Subtitle
    doc.setFontSize(15);
    doc.setTextColor(250, 249, 247);
    doc.text('Weight Loss Percentage', 30, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(214, 211, 209);
    doc.text('Official Clinical & Metabolic Calculation Summary  |  https://www.weightlosspercentage.com/', 30, 20);

    // Date & Privacy Stamp
    doc.setFontSize(8.5);
    doc.setTextColor(181, 175, 166);
    doc.text(`Report Date: ${dateStr}   •   100% Client-Side Browser Calculation (Zero Server Data Storage)`, 14, 29);

    // Medical Review Governance Bar
    doc.setFillColor(250, 249, 247);
    doc.setDrawColor(229, 225, 216);
    doc.roundedRect(14, 40, 182, 18, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(28, 25, 23);
    doc.text('Medically Reviewed Protocol: Dr. Rekha Kumar, M.D., M.S.', 19, 47);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(87, 83, 78);
    doc.text(
      'Board-Certified Endocrinologist & ABOM Diplomate  |  Associate Professor of Clinical Medicine, Weill Cornell Medicine',
      19,
      53
    );

    let y = 68;

    if (mode === 'adult') {
      const goalPct =
        gWeight > 0 && sWeight !== gWeight
          ? Math.max(0, Math.min(100, +(((sWeight - cWeight) / (sWeight - gWeight)) * 100).toFixed(0)))
          : 0;
      const kcalEquivalent = Math.round(Math.abs(adultLost) * (unit === 'kg' ? 7700 : 3500));

      // Section Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(28, 25, 23);
      doc.text('1. Patient Weight Loss Percentage Summary', 14, y);
      y += 6;

      // Primary Hero Highlight Card
      doc.setFillColor(250, 249, 247);
      doc.setDrawColor(229, 225, 216);
      doc.roundedRect(14, y, 182, 28, 2.5, 2.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 113, 108);
      doc.text('Total body weight percentage change', 20, y + 8);

      doc.setFontSize(22);
      doc.setTextColor(194, 65, 12);
      doc.text(`${isLoss ? `-${adultPct}%` : `+${adultPct}%`}`, 20, y + 20);

      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(
        `Net Weight Change: ${isLoss ? `-${adultLost.toFixed(1)}` : `+${Math.abs(adultLost).toFixed(1)}`} ${unit}`,
        78,
        y + 13
      );
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Formula: ((Starting Weight - Current Weight) / Starting Weight) × 100`,
        78,
        y + 21
      );
      y += 36;

      // Detailed Biometric Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Recorded Anthropometric & Goal Metrics', 14, y);
      y += 5;

      const rows: [string, string][] = [
        ['Initial Starting Weight', `${sWeight.toFixed(1)} ${unit}`],
        ['Current Scale Weight', `${cWeight.toFixed(1)} ${unit} (${currentStoneAndLbs.stones} st ${currentStoneAndLbs.pounds} lbs)`],
        ['Net Weight Difference', `${isLoss ? `-${adultLost.toFixed(1)}` : `+${Math.abs(adultLost).toFixed(1)}`} ${unit} (${lostStoneAndLbs.stones} st ${lostStoneAndLbs.pounds} lbs)`],
        ['Percentage of Baseline Body Weight', `${isLoss ? `-${adultPct}%` : `+${adultPct}%`}`],
        ['Bariatric Excess Weight Loss (%EWL)', `${excessWeightLostPct}% EWL`],
        ['Target Goal Weight', gWeight > 0 ? `${gWeight.toFixed(1)} ${unit}` : 'Not specified'],
        [
          'Remaining Weight to Goal',
          gWeight > 0 ? `${Math.max(0, cWeight - gWeight).toFixed(1)} ${unit} (${goalPct}% of goal achieved)` : 'N/A'
        ],
        ['Estimated Cumulative Energy Deficit', `${kcalEquivalent.toLocaleString()} kcal`]
      ];

      rows.forEach(([label, val], idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y, 182, 8.5, 'F');
        }
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y + 8.5, 196, y + 8.5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text(label, 18, y + 5.8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(val, 192, y + 5.8, { align: 'right' });
        y += 8.5;
      });

      y += 10;

      // Clinical Milestones Evaluation
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('3. Clinical Health Milestones Evaluation (AHA / ADA / NIH Look AHEAD)', 14, y);
      y += 6;

      const milestones = [
        {
          title: `5% clinical milestone (${(sWeight * 0.95).toFixed(1)} ${unit})`,
          status: adultPct >= 5 ? 'Reached' : 'In progress',
          desc: 'Clinically meaningful improvements in HbA1c, insulin sensitivity, and systolic blood pressure (~5 mmHg).'
        },
        {
          title: `10% clinical milestone (${(sWeight * 0.90).toFixed(1)} ${unit})`,
          status: adultPct >= 10 ? 'Reached' : 'In progress',
          desc: 'Significant visceral adipose reduction, lipid profile improvement, and sleep apnea symptom relief.'
        },
        {
          title: `15% clinical milestone (${(sWeight * 0.85).toFixed(1)} ${unit})`,
          status: adultPct >= 15 ? 'Reached' : 'In progress',
          desc: 'Major cardiovascular risk reduction and clinical remission markers in Type 2 Diabetes.'
        }
      ];

      milestones.forEach((m) => {
        doc.setFillColor(250, 249, 247);
        doc.setDrawColor(229, 225, 216);
        doc.roundedRect(14, y, 182, 15, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(28, 25, 23);
        doc.text(m.title, 18, y + 6);

        doc.setFontSize(8.5);
        doc.setTextColor(m.status === 'Reached' ? 194 : 120, m.status === 'Reached' ? 65 : 113, m.status === 'Reached' ? 12 : 108);
        doc.text(m.status, 192, y + 6, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(87, 83, 78);
        doc.text(m.desc, 18, y + 11.8);
        y += 18;
      });
    } else if (mode === 'newborn') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(28, 25, 23);
      doc.text('1. Newborn Postnatal Weight Loss Summary (AAP Protocol)', 14, y);
      y += 6;

      doc.setFillColor(250, 249, 247);
      doc.setDrawColor(229, 225, 216);
      doc.roundedRect(14, y, 182, 26, 2.5, 2.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(194, 65, 12);
      doc.text(`-${newbornLossPct}%  (-${newbornGramsLost} g)`, 20, y + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(87, 83, 78);
      doc.text(
        `Birth Weight: ${birthGramsTotal} g   |   Current Weight: ${currentGramsTotal} g   |   Postnatal Age: ${babyHoursOld} hours`,
        20,
        y + 21
      );
      y += 34;

      const statusText =
        newbornLossPct < 7
          ? 'NORMAL (<7%): Within expected physiological neonatal fluid diuresis.'
          : newbornLossPct <= 10
          ? 'OBSERVATION (7% to 10%): Monitor feeding frequency, wet diapers, and lactation latch.'
          : 'PEDIATRIC ALERT (>10%): Exceeds 10% threshold. Immediate clinical & lactation evaluation recommended.';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Clinical AAP Assessment:', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(statusText, 14, y);
      y += 14;
    } else if (mode === 'bmr') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Resting & Total Daily Energy Expenditure (Mifflin-St Jeor)', 14, y);
      y += 8;

      const bmrRows: [string, string][] = [
        ['Biological Profile', `Age: ${age} yrs  |  Sex: ${gender.toUpperCase()}  |  Height: ${heightInches} in`],
        ['Basal Metabolic Rate (BMR)', `${calculatedBmr} kcal / day`],
        ['Maintenance Total Daily Energy Expenditure (TDEE)', `${calculatedTdee} kcal / day`],
        ['Safe Weight Loss Target (-500 kcal/day ~ 1 lb/wk)', `${Math.max(1200, calculatedTdee - 500)} kcal / day`]
      ];

      bmrRows.forEach(([label, val], idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y, 182, 9, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text(label, 18, y + 6);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(val, 192, y + 6, { align: 'right' });
        y += 9;
      });
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(
        activeBrand === 'five-guys'
          ? '1. Five Guys Meal Nutrition & Calorie Summary'
          : activeBrand === 'mcdonalds'
          ? '1. McDonald’s Meal Nutrition & Calorie Summary'
          : '1. Subway Meal Nutrition & Calorie Summary',
        14,
        y
      );
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        activeBrand === 'five-guys'
          ? `Burger (${fiveGuysBurger} kcal) + Fries (${fiveGuysFries} kcal) + Beverage (${fiveGuysDrink} kcal) = ${fiveGuysTotalCalories} kcal`
          : activeBrand === 'mcdonalds'
          ? `Entrée (${mcdMain} kcal) + Side (${mcdFries} kcal) + Beverage (${mcdDrink} kcal) + Sauce (${mcdSauce} kcal) = ${mcdTotalCalories} kcal`
          : `Sandwich Portion: ${subwaySize === 'footlong' ? '12-Inch Footlong' : '6-Inch Sub'}   |   Total Meal Energy: ${subwayTotalCalories} kcal`,
        14,
        y
      );
    }

    // Bottom Clinical References & Medical Disclaimer Footer
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, 246, 182, 34, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Medical & Clinical Disclaimer (For Patient & Healthcare Provider Reference)', 18, 253);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(71, 85, 105);
    const disclaimerLines = doc.splitTextToSize(
      'This report is generated for educational and personal tracking purposes using peer-reviewed equations (Mifflin-St Jeor, AAP Neonatal Guidelines, NIH Look AHEAD). It does not constitute a formal medical diagnosis or clinical prescription. Always consult a board-certified physician, pediatrician, or registered dietitian before making nutritional or clinical decisions.',
      174
    );
    doc.text(disclaimerLines, 18, 258.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Weight Loss Percentage (weightlosspercentage.com)  •  Reviewed by Dr. Rekha Kumar, M.D., M.S.',
      105,
      276,
      { align: 'center' }
    );

    doc.save(`weight-loss-percentage-report-${dateStr}.pdf`);
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 2500);
  };

  const copySummary = () => {
    let summary = '';
    if (mode === 'adult') {
      summary = `Weight Loss: ${adultLost.toFixed(1)} ${unit} (${adultPct}%) | Start: ${sWeight} ${unit} | Current: ${cWeight} ${unit} via weightlosspercentage.com`;
    } else if (mode === 'newborn') {
      summary = `Newborn Weight Loss: ${newbornLossPct}% (${newbornGramsLost}g loss at ${babyHoursOld}h) via weightlosspercentage.com`;
    } else {
      summary = `BMR: ${calculatedBmr} kcal | TDEE: ${calculatedTdee} kcal via weightlosspercentage.com`;
    }
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hero-tool-box relative w-full bg-[#ffffff] dark:bg-[#1c1917] rounded-2xl border border-[#e5e1d8] dark:border-[#332f2b] shadow-sm overflow-hidden transition-colors duration-200">
      {/* Tool Topbar with Responsive Mode Selector Grid (2x2 on mobile, row on desktop) */}
      <div className="border-b border-[#e5e1d8] dark:border-[#332f2b] bg-[#faf9f7] dark:bg-[#141210] px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Mode Switcher: 2x2 grid on mobile for easy 44px+ touch targets */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('adult')}
            className={`min-h-[40px] px-3 py-2 rounded-[8px] text-xs font-medium transition-colors duration-150 flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap cursor-pointer ${
              mode === 'adult'
                ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            <Scale className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{t.tabAdult}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('newborn')}
            className={`min-h-[40px] px-3 py-2 rounded-[8px] text-xs font-medium transition-colors duration-150 flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap cursor-pointer ${
              mode === 'newborn'
                ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            <Baby className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{t.tabNewborn}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('bmr')}
            className={`min-h-[40px] px-3 py-2 rounded-[8px] text-xs font-medium transition-colors duration-150 flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap cursor-pointer ${
              mode === 'bmr'
                ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            <Flame className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{t.tabBmr}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('subway')}
            className={`min-h-[40px] px-3 py-2 rounded-[8px] text-xs font-medium transition-colors duration-150 flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap cursor-pointer ${
              mode === 'subway'
                ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
            }`}
          >
            <Utensils className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{t.tabSubway}</span>
          </button>
        </div>

        {/* Unit Toggle for Adult/BMR */}
        {mode === 'adult' && (
          <div className="grid grid-cols-2 sm:flex items-center bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[10px] p-1 text-xs font-medium shrink-0">
            <button
              type="button"
              onClick={() => setUnit('lbs')}
              className={`min-h-[36px] sm:min-h-[32px] px-3 py-1 rounded-[8px] transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                unit === 'lbs'
                  ? 'bg-[#ffffff] dark:bg-[#1c1917] text-[#1c1917] dark:text-[#f5f3ef] shadow-xs'
                  : 'text-[#57534e] dark:text-[#b5afa6] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
              }`}
            >
              {t.unitLbs}
            </button>
            <button
              type="button"
              onClick={() => setUnit('kg')}
              className={`min-h-[36px] sm:min-h-[32px] px-3 py-1 rounded-[8px] transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                unit === 'kg'
                  ? 'bg-[#ffffff] dark:bg-[#1c1917] text-[#1c1917] dark:text-[#f5f3ef] shadow-xs'
                  : 'text-[#57534e] dark:text-[#b5afa6] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
              }`}
            >
              {t.unitKg}
            </button>
          </div>
        )}
      </div>

      {/* Main Tool Interactive Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Reactive Inputs & Mobile Touch Steppers */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mobile Instant Live Result Strip (visible immediately above inputs on phone viewports) */}
          <div className="lg:hidden bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6] block">
                {mode === 'adult'
                  ? 'Instant weight loss %'
                  : mode === 'newborn'
                  ? 'Newborn weight change'
                  : mode === 'bmr'
                  ? 'Daily BMR / TDEE'
                  : activeBrand === 'five-guys'
                  ? 'Five Guys meal total'
                  : activeBrand === 'mcdonalds'
                  ? (p.mcdResultHeading || "McDonald's meal total")
                  : (t.resultHeadingSubway || 'Subway meal total')}
              </span>
              <div className="flex items-baseline gap-2 tabular-nums mt-0.5">
                {mode === 'adult' && (
                  <>
                    <span className="text-2xl font-medium text-[#c2410c] dark:text-[#ea580c]">
                      {isLoss ? `-${adultPct}%` : `${adultPct}%`}
                    </span>
                    <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6]">
                      ({isLoss ? `-${adultLost.toFixed(1)}` : `+${Math.abs(adultLost).toFixed(1)}`} {unit})
                    </span>
                  </>
                )}
                {mode === 'newborn' && (
                  <>
                    <span className="text-2xl font-medium text-[#c2410c] dark:text-[#ea580c]">{newbornLossPct}%</span>
                    <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6]">(-{newbornGramsLost} g)</span>
                  </>
                )}
                {mode === 'bmr' && (
                  <>
                    <span className="text-xl font-medium text-[#c2410c] dark:text-[#ea580c]">{calculatedBmr} kcal</span>
                    <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6]">/ {calculatedTdee} TDEE</span>
                  </>
                )}
                {mode === 'subway' && (
                  <span className="text-2xl font-medium text-[#c2410c] dark:text-[#ea580c]">{activeRestaurantCalories} kcal</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={downloadResult}
              className="min-h-[40px] px-3 py-2 rounded-[8px] bg-[#c2410c] hover:bg-[#9a3412] text-white font-medium text-xs transition-colors duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" strokeWidth={1.75} />
              <span>{t.downloadReport}</span>
            </button>
          </div>

          {/* Quick-Win Preset Buttons & Clinical Focus Selector */}
          <div className="space-y-3">
            {mode === 'adult' && (
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: 'standard', label: p.focusStandard },
                    { id: 'fasting', label: p.focusFasting },
                    { id: 'bariatric', label: p.focusBariatric },
                    { id: 'glp1', label: p.focusGlp1 },
                    { id: 'postpartum', label: p.focusPostpartum }
                  ] as { id: ClinicalFocus; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleFocusSelect(item.id)}
                    className={`min-h-[34px] px-3 py-1 rounded-[8px] text-xs font-medium transition-colors duration-150 border cursor-pointer ${
                      activeFocus === item.id
                        ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917] border-[#1c1917] dark:border-[#f5f3ef]'
                        : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] border-[#e5e1d8] dark:border-[#332f2b] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] hover:text-[#1c1917] dark:hover:text-[#f5f3ef]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6] block">
                {t.presetHeading}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {mode === 'adult' && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setAdultStart('215'); setAdultCurrent('193.5'); setAdultGoal('175'); }}
                      className="min-h-[36px] px-3 py-1 rounded-[8px] bg-[#faf9f7] dark:bg-[#141210] text-[#1c1917] dark:text-[#f5f3ef] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] font-normal text-xs border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer"
                    >
                      10% loss (215 → 193.5)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAdultStart('180'); setAdultCurrent('171'); setAdultGoal('155'); }}
                      className="min-h-[36px] px-3 py-1 rounded-[8px] bg-[#faf9f7] dark:bg-[#141210] text-[#1c1917] dark:text-[#f5f3ef] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] font-normal text-xs border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer"
                    >
                      5% milestone (180 → 171)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAdultStart('260'); setAdultCurrent('221'); setAdultGoal('190'); }}
                      className="min-h-[36px] px-3 py-1 rounded-[8px] bg-[#faf9f7] dark:bg-[#141210] text-[#1c1917] dark:text-[#f5f3ef] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] font-normal text-xs border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer"
                    >
                      15% loss (260 → 221)
                    </button>
                  </>
                )}

                {mode === 'newborn' && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setBirthLbs('8'); setBirthOz('4'); setCurrentLbs('7'); setCurrentOz('10'); setBabyHoursOld('48'); }}
                      className="min-h-[36px] px-3 py-1 rounded-[8px] bg-[#faf9f7] dark:bg-[#141210] text-[#1c1917] dark:text-[#f5f3ef] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] font-normal text-xs border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer"
                    >
                      Day 2 example (7.6% drop)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setBirthLbs('7'); setBirthOz('8'); setCurrentLbs('6'); setCurrentOz('11'); setBabyHoursOld('72'); }}
                      className="min-h-[36px] px-3 py-1 rounded-[8px] bg-[#faf9f7] dark:bg-[#141210] text-[#1c1917] dark:text-[#f5f3ef] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] font-normal text-xs border border-[#e5e1d8] dark:border-[#332f2b] transition-colors duration-150 whitespace-nowrap shrink-0 tabular-nums cursor-pointer"
                    >
                      Over 10% check (10.8% drop)
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* MODE 1: ADULT WEIGHT LOSS PERCENTAGE */}
          {mode === 'adult' && (
            <div className="space-y-4">
              {/* Specialized Clinical Protocol Selector (when Fasting, Bariatric, GLP-1, or Postpartum is active) */}
              {activeFocus === 'fasting' && (
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="fasting-protocol-select" className="text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                      Water fast / OMAD protocol duration
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (sWeight > 0) {
                          setAdultCurrent(Math.max(1, +(sWeight - fastingTotalDrop).toFixed(1)).toString());
                        }
                      }}
                      className="px-3 py-1 rounded-[8px] bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917] text-xs font-medium hover:opacity-90 transition-opacity duration-150 tabular-nums cursor-pointer"
                    >
                      Apply projected weight (-{fastingTotalDrop} {unit})
                    </button>
                  </div>
                  <select
                    id="fasting-protocol-select"
                    value={fastingProtocol}
                    onChange={(e) => setFastingProtocol(e.target.value as typeof fastingProtocol)}
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                  >
                    <option value="24h">24-Hour Water Fast (1 Day • Glycogen Initiation)</option>
                    <option value="48h">48-Hour Water Fast (2 Days • Deep Ketosis Transition)</option>
                    <option value="72h">72-Hour Water Fast (3 Days • Full Glycogen Depletion)</option>
                    <option value="5d">5-Day Extended Water Fast (Physician-Monitored)</option>
                    <option value="7d">7-Day Extended Water Fast (Clinical Supervision Required)</option>
                    <option value="omad30">OMAD 23:1 (One Meal a Day • 30-Day Projection)</option>
                    <option value="if16_8">16:8 Intermittent Fasting (30-Day Projection)</option>
                  </select>
                </div>
              )}

              {activeFocus === 'bariatric' && (
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] space-y-2">
                  <label htmlFor="bariatric-procedure-select" className="block text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                    Bariatric surgical procedure (ASMBS %EWL curve)
                  </label>
                  <select
                    id="bariatric-procedure-select"
                    value={bariatricProcedure}
                    onChange={(e) => setBariatricProcedure(e.target.value as typeof bariatricProcedure)}
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                  >
                    <option value="vsg">Vertical Sleeve Gastrectomy (VSG — ~62% EWL / ~25% TBWL)</option>
                    <option value="rny">Roux-en-Y Gastric Bypass (RNY — ~70% EWL / ~30% TBWL)</option>
                    <option value="ds">Biliopancreatic Diversion w/ Duodenal Switch (BPD/DS — ~80% EWL)</option>
                  </select>
                </div>
              )}

              {activeFocus === 'glp1' && (
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] space-y-2">
                  <label htmlFor="glp1-medication-select" className="block text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                    GLP-1 / GIP medication and clinical trial benchmark
                  </label>
                  <select
                    id="glp1-medication-select"
                    value={glp1Medication}
                    onChange={(e) => setGlp1Medication(e.target.value as typeof glp1Medication)}
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                  >
                    <option value="semaglutide">Semaglutide (Ozempic® / Wegovy® — STEP-1 Trial: 14.9% TBWL)</option>
                    <option value="tirzepatide">Tirzepatide (Mounjaro® / Zepbound® — SURMOUNT-1 Trial: 20.9% TBWL)</option>
                    <option value="retatrutide">Retatrutide Phase 2 Benchmark (Triple-Agonist: 24.2% TBWL)</option>
                    <option value="phentermine">Phentermine / Tesamorelin Reference (Short-Term 7.5% TBWL)</option>
                  </select>
                </div>
              )}

              {activeFocus === 'postpartum' && (
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] space-y-2">
                  <label htmlFor="lactation-status-select" className="block text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                    Postpartum lactation and breastfeeding energy output
                  </label>
                  <select
                    id="lactation-status-select"
                    value={lactationStatus}
                    onChange={(e) => setLactationStatus(e.target.value as typeof lactationStatus)}
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                  >
                    <option value="exclusive">Exclusive Breastfeeding (+450 kcal/day milk synthesis • Min 1,800 kcal)</option>
                    <option value="combo">Combination Breast + Formula Feeding (+250 kcal/day • Min 1,650 kcal)</option>
                    <option value="none">Formula Feeding / Non-Lactating (+0 kcal/day • Standard Deficit)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Starting Weight with Touch Stepper */}
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <label htmlFor="adult-start-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                    {t.startWeightLabel} ({unit})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => stepValue(adultStart, setAdultStart, -1)}
                      aria-label="Decrease starting weight"
                      className="w-11 h-11 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] flex items-center justify-center text-[#1c1917] dark:text-[#f5f3ef] shrink-0 transition-colors duration-150 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                    <div className="relative flex-1">
                      <input
                        id="adult-start-input"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        value={adultStart}
                        onChange={(e) => setAdultStart(e.target.value)}
                        placeholder="215"
                        className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-center text-lg font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => stepValue(adultStart, setAdultStart, 1)}
                      aria-label="Increase starting weight"
                      className="w-11 h-11 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] flex items-center justify-center text-[#1c1917] dark:text-[#f5f3ef] shrink-0 transition-colors duration-150 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                {/* Current Weight with Touch Stepper */}
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <label htmlFor="adult-current-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                    {t.currentWeightLabel} ({unit})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => stepValue(adultCurrent, setAdultCurrent, -0.5)}
                      aria-label="Decrease current weight"
                      className="w-11 h-11 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] flex items-center justify-center text-[#1c1917] dark:text-[#f5f3ef] shrink-0 transition-colors duration-150 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                    <div className="relative flex-1">
                      <input
                        id="adult-current-input"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        value={adultCurrent}
                        onChange={(e) => setAdultCurrent(e.target.value)}
                        placeholder="193.5"
                        className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-center text-lg font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => stepValue(adultCurrent, setAdultCurrent, 0.5)}
                      aria-label="Increase current weight"
                      className="w-11 h-11 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] flex items-center justify-center text-[#1c1917] dark:text-[#f5f3ef] shrink-0 transition-colors duration-150 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Empathetic, Humanized Inline Input Validation & Guidance Banner */}
              {(sWeight <= 0 || cWeight <= 0) ? (
                <div
                  role="status"
                  data-testid="input-feedback-banner"
                  className="p-3 rounded-xl bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] text-xs flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span>
                    Please enter a starting weight and current weight above 0 {unit} to calculate your percentage change.
                  </span>
                </div>
              ) : (sWeight > 1200 || cWeight > 1200) ? (
                <div
                  role="status"
                  data-testid="input-feedback-banner"
                  className="p-3 rounded-xl bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] text-xs flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span>
                    That weight is over 1,200 {unit}. Double-check your digits or make sure you have the right unit ({unit}) selected above.
                  </span>
                </div>
              ) : cWeight > sWeight ? (
                <div
                  role="status"
                  data-testid="input-feedback-banner"
                  className="p-3 rounded-xl bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] text-xs flex items-start justify-between gap-3"
                >
                  <span className="tabular-nums">
                    Your current weight is <span className="font-semibold">{Math.abs(adultLost).toFixed(1)} {unit} higher</span> than your starting weight (a <span className="font-semibold">+{Math.abs(adultPct)}% weight gain</span>). If you meant to calculate weight loss, swap the two numbers.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const prevStart = adultStart;
                      setAdultStart(adultCurrent);
                      setAdultCurrent(prevStart);
                    }}
                    className="px-3 py-1 rounded-[8px] bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917] font-medium text-xs shrink-0 hover:opacity-90 transition-opacity duration-150 cursor-pointer"
                  >
                    {t.swapWeightsBtn}
                  </button>
                </div>
              ) : null}

              {/* Target Goal Weight with Touch Stepper */}
              <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                <label htmlFor="adult-goal-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                  {t.goalWeightLabel}{' '}({unit}){' '}<span className="text-[#78716c] dark:text-[#8c857d] font-normal">{t.optionalLabel}</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stepValue(adultGoal, setAdultGoal, -1)}
                    aria-label="Decrease goal weight"
                    className="w-11 h-11 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] flex items-center justify-center text-[#1c1917] dark:text-[#f5f3ef] shrink-0 transition-colors duration-150 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <input
                    id="adult-goal-input"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={adultGoal}
                    onChange={(e) => setAdultGoal(e.target.value)}
                    placeholder="175"
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-center text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => stepValue(adultGoal, setAdultGoal, 1)}
                    aria-label="Increase goal weight"
                    className="w-11 h-11 rounded-[8px] bg-[#f3f1ed] dark:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b] flex items-center justify-center text-[#1c1917] dark:text-[#f5f3ef] shrink-0 transition-colors duration-150 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* Formula Callout */}
              <div className="p-3 bg-[#faf9f7] dark:bg-[#141210] rounded-xl border border-[#edeae3] dark:border-[#2a2623] text-xs text-[#57534e] dark:text-[#b5afa6] flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef]">{t.formulaLabel}</span>
                <span className="text-[#78716c] dark:text-[#8c857d] text-[11px]">{t.worksInUnits}</span>
              </div>
            </div>
          )}

          {/* MODE 2: NEWBORN WEIGHT LOSS */}
          {mode === 'newborn' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setBabyUnit('lbs_oz')}
                  className={`min-h-[40px] px-3 py-2 rounded-[8px] font-medium transition-colors duration-150 cursor-pointer ${
                    babyUnit === 'lbs_oz'
                      ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                      : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b]'
                  }`}
                >
                  {t.lbsOzUnit}
                </button>
                <button
                  type="button"
                  onClick={() => setBabyUnit('grams')}
                  className={`min-h-[40px] px-3 py-2 rounded-[8px] font-medium transition-colors duration-150 cursor-pointer ${
                    babyUnit === 'grams'
                      ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                      : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b]'
                  }`}
                >
                  {t.gramsUnit}
                </button>
              </div>

              {babyUnit === 'lbs_oz' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      {t.birthWeightLbsOz}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          aria-label="Birth weight pounds"
                          value={birthLbs}
                          onChange={(e) => setBirthLbs(e.target.value)}
                          className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                          placeholder="lbs"
                        />
                        <span className="absolute right-2.5 top-3 text-xs text-[#78716c] dark:text-[#8c857d] font-normal">lbs</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label="Birth weight ounces"
                          value={birthOz}
                          onChange={(e) => setBirthOz(e.target.value)}
                          className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                          placeholder="oz"
                        />
                        <span className="absolute right-2.5 top-3 text-xs text-[#78716c] dark:text-[#8c857d] font-normal">oz</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      {t.currentWeightLbsOz}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          aria-label="Current weight pounds"
                          value={currentLbs}
                          onChange={(e) => setCurrentLbs(e.target.value)}
                          className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                          placeholder="lbs"
                        />
                        <span className="absolute right-2.5 top-3 text-xs text-[#78716c] dark:text-[#8c857d] font-normal">lbs</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label="Current weight ounces"
                          value={currentOz}
                          onChange={(e) => setCurrentOz(e.target.value)}
                          className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                          placeholder="oz"
                        />
                        <span className="absolute right-2.5 top-3 text-xs text-[#78716c] dark:text-[#8c857d] font-normal">oz</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label htmlFor="birth-grams-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      {t.birthWeightGrams}
                    </label>
                    <input
                      id="birth-grams-input"
                      type="number"
                      inputMode="numeric"
                      value={birthGrams}
                      onChange={(e) => setBirthGrams(e.target.value)}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                      placeholder="3500"
                    />
                  </div>
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label htmlFor="current-grams-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      {t.currentWeightGrams}
                    </label>
                    <input
                      id="current-grams-input"
                      type="number"
                      inputMode="numeric"
                      value={currentGrams}
                      onChange={(e) => setCurrentGrams(e.target.value)}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                      placeholder="3250"
                    />
                  </div>
                </div>
              )}

              <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                <label htmlFor="baby-hours-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                  {t.babyAgeHours}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id="baby-hours-input"
                    type="number"
                    inputMode="numeric"
                    value={babyHoursOld}
                    onChange={(e) => setBabyHoursOld(e.target.value)}
                    className="w-32 h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                    placeholder="48"
                  />
                  <div className="flex gap-2">
                    {['24', '48', '72', '96'].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setBabyHoursOld(h)}
                        className={`min-h-[40px] px-3 rounded-[8px] text-xs font-medium border transition-colors duration-150 tabular-nums cursor-pointer ${
                          babyHoursOld === h
                            ? 'bg-[#1c1917] dark:bg-[#f5f3ef] border-[#1c1917] dark:border-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                            : 'bg-[#ffffff] dark:bg-[#1c1917] border-[#e5e1d8] dark:border-[#332f2b] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f]'
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: BMR & TDEE */}
          {mode === 'bmr' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <label htmlFor="bmr-age-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">{t.ageYearsLabel}</label>
                  <input
                    id="bmr-age-input"
                    type="number"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] font-medium text-base text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                  />
                </div>
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <label htmlFor="bmr-sex-select" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">{t.sexLabel}</label>
                  <select
                    id="bmr-sex-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'female' | 'male')}
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                  >
                    <option value="female">{t.femaleLabel}</option>
                    <option value="male">{t.maleLabel}</option>
                  </select>
                </div>
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <label htmlFor="bmr-height-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">{t.heightInchesLabel}</label>
                  <input
                    id="bmr-height-input"
                    type="number"
                    inputMode="numeric"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] font-medium text-base text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                    placeholder="66"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <label htmlFor="bmr-activity-select" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">{t.activityLabel}</label>
                  <select
                    id="bmr-activity-select"
                    value={activityFactor}
                    onChange={(e) => setActivityFactor(e.target.value)}
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-xs sm:text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                  >
                    <option value="1.2">Sedentary (Desk work, minimal exercise)</option>
                    <option value="1.375">Light Activity (1-3 days/week exercise)</option>
                    <option value="1.55">Moderate Activity (3-5 days/week cycling/gym)</option>
                    <option value="1.725">Very Active (6-7 days intense training)</option>
                  </select>
                </div>

                <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                  <label htmlFor="bmr-daily-intake-input" className="block text-xs font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                    Daily calorie intake target (kcal/day)
                  </label>
                  <input
                    id="bmr-daily-intake-input"
                    type="number"
                    inputMode="numeric"
                    value={customDailyIntake}
                    onChange={(e) => setCustomDailyIntake(e.target.value)}
                    placeholder="1550"
                    className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] font-medium text-base text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef] tabular-nums"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MODE 4: RESTAURANT NUTRITION (SUBWAY & MCDONALD'S) */}
          {mode === 'subway' && (
            <div className="space-y-4">
              {/* Brand Switcher: McDonald's vs Subway vs Five Guys */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleBrandSelect('mcdonalds')}
                  className={`min-h-[40px] px-2 py-2 rounded-[8px] font-medium transition-colors duration-150 cursor-pointer text-center ${
                    activeBrand === 'mcdonalds'
                      ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                      : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b]'
                  }`}
                >
                  {p.mcdBuilderBtn}
                </button>
                <button
                  type="button"
                  onClick={() => handleBrandSelect('subway')}
                  className={`min-h-[40px] px-2 py-2 rounded-[8px] font-medium transition-colors duration-150 cursor-pointer text-center ${
                    activeBrand === 'subway'
                      ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                      : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b]'
                  }`}
                >
                  {p.subwayBuilderBtn}
                </button>
                <button
                  type="button"
                  onClick={() => handleBrandSelect('five-guys')}
                  className={`min-h-[40px] px-2 py-2 rounded-[8px] font-medium transition-colors duration-150 cursor-pointer text-center ${
                    activeBrand === 'five-guys'
                      ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                      : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b]'
                  }`}
                >
                  Five Guys
                </button>
              </div>

              {activeBrand === 'five-guys' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] sm:col-span-2">
                    <label htmlFor="fg-burger-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      Five Guys burger selection
                    </label>
                    <select
                      id="fg-burger-select"
                      value={fiveGuysBurger}
                      onChange={(e) => setFiveGuysBurger(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    >
                      <option value={840}>Hamburger (840 kcal)</option>
                      <option value={980}>Cheeseburger (980 kcal)</option>
                      <option value={920}>Bacon Burger (920 kcal)</option>
                      <option value={1060}>Bacon Cheeseburger (1,060 kcal)</option>
                      <option value={540}>Little Hamburger (540 kcal)</option>
                      <option value={610}>Little Cheeseburger (610 kcal)</option>
                    </select>
                  </div>
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label htmlFor="fg-fries-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      Fresh cut peanut oil fries
                    </label>
                    <select
                      id="fg-fries-select"
                      value={fiveGuysFries}
                      onChange={(e) => setFiveGuysFries(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    >
                      <option value={0}>No Fries (0 kcal)</option>
                      <option value={526}>Little Fresh Cut Fries (526 kcal)</option>
                      <option value={953}>Regular Fresh Cut Fries (953 kcal)</option>
                      <option value={1314}>Large Fresh Cut Fries (1,314 kcal)</option>
                    </select>
                  </div>
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label htmlFor="fg-drink-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      Beverage and shake choice
                    </label>
                    <select
                      id="fg-drink-select"
                      value={fiveGuysDrink}
                      onChange={(e) => setFiveGuysDrink(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    >
                      <option value={0}>Diet Soda / Water (0 kcal)</option>
                      <option value={200}>Regular Fountain Soda (200 kcal)</option>
                      <option value={670}>Five Guys Milkshake Base (670 kcal)</option>
                      <option value={840}>Five Guys Milkshake w/ Mix-ins (840 kcal)</option>
                    </select>
                  </div>
                </div>
              ) : activeBrand === 'mcdonalds' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label htmlFor="mcd-main-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      Burger / main entrée
                    </label>
                    <select
                      id="mcd-main-select"
                      value={mcdMain}
                      onChange={(e) => setMcdMain(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    >
                      <option value={590}>Big Mac (590 kcal • 25g protein)</option>
                      <option value={520}>Quarter Pounder w/ Cheese (520 kcal • 30g protein)</option>
                      <option value={410}>10 pc Chicken McNuggets (410 kcal • 23g protein)</option>
                      <option value={400}>McChicken Sandwich (400 kcal • 14g protein)</option>
                      <option value={390}>Filet-O-Fish (390 kcal • 16g protein)</option>
                      <option value={300}>Cheeseburger (300 kcal • 15g protein)</option>
                    </select>
                  </div>
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label htmlFor="mcd-fries-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      Fries / side portion
                    </label>
                    <select
                      id="mcd-fries-select"
                      value={mcdFries}
                      onChange={(e) => setMcdFries(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    >
                      <option value={0}>No Fries / Apple Slices (15 kcal)</option>
                      <option value={230}>Small World Famous Fries (230 kcal)</option>
                      <option value={320}>Medium World Famous Fries (320 kcal)</option>
                      <option value={480}>Large World Famous Fries (480 kcal)</option>
                    </select>
                  </div>
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label htmlFor="mcd-drink-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      Beverage choice
                    </label>
                    <select
                      id="mcd-drink-select"
                      value={mcdDrink}
                      onChange={(e) => setMcdDrink(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    >
                      <option value={0}>Diet Coke / Coke Zero / Water (0 kcal)</option>
                      <option value={140}>Iced Coffee Sugar-Free Vanilla (140 kcal)</option>
                      <option value={210}>Medium Coca-Cola Classic (210 kcal)</option>
                      <option value={530}>Medium Oreo McFlurry (530 kcal)</option>
                    </select>
                  </div>
                  <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                    <label htmlFor="mcd-sauce-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">
                      Dipping sauce packet
                    </label>
                    <select
                      id="mcd-sauce-select"
                      value={mcdSauce}
                      onChange={(e) => setMcdSauce(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                    >
                      <option value={0}>No Dipping Sauce (0 kcal)</option>
                      <option value={45}>Tangy Barbeque Sauce (45 kcal)</option>
                      <option value={50}>Sweet ‘N Sour Sauce (50 kcal)</option>
                      <option value={110}>Creamy Ranch Sauce (110 kcal)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSubwaySize('six_inch')}
                      className={`min-h-[40px] px-3 py-2 rounded-[8px] font-medium transition-colors duration-150 cursor-pointer ${
                        subwaySize === 'six_inch'
                          ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                          : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b]'
                      }`}
                    >
                      6-inch sub
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubwaySize('footlong')}
                      className={`min-h-[40px] px-3 py-2 rounded-[8px] font-medium transition-colors duration-150 cursor-pointer ${
                        subwaySize === 'footlong'
                          ? 'bg-[#1c1917] dark:bg-[#f5f3ef] text-[#faf9f7] dark:text-[#1c1917]'
                          : 'bg-[#f3f1ed] dark:bg-[#25221f] text-[#57534e] dark:text-[#b5afa6] hover:bg-[#e5e1d8] dark:hover:bg-[#332f2b]'
                      }`}
                    >
                      Footlong (12-inch)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                      <label htmlFor="subway-bread-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">Bread choice</label>
                      <select
                        id="subway-bread-select"
                        value={subwayBread}
                        onChange={(e) => setSubwayBread(Number(e.target.value))}
                        className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                      >
                        <option value={200}>9-Grain Wheat (200 kcal)</option>
                        <option value={190}>Artisan Italian White (190 kcal)</option>
                        <option value={230}>Italian Herbs & Cheese (230 kcal)</option>
                      </select>
                    </div>
                    <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                      <label htmlFor="subway-meat-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">Protein filling</label>
                      <select
                        id="subway-meat-select"
                        value={subwayMeat}
                        onChange={(e) => setSubwayMeat(Number(e.target.value))}
                        className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                      >
                        <option value={110}>Oven Roasted Turkey (110 kcal)</option>
                        <option value={160}>Rotisserie Style Chicken (160 kcal)</option>
                        <option value={250}>Philly Steak (250 kcal)</option>
                        <option value={290}>Italian B.M.T. (290 kcal)</option>
                      </select>
                    </div>
                    <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                      <label htmlFor="subway-cheese-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">Cheese option</label>
                      <select
                        id="subway-cheese-select"
                        value={subwayCheese}
                        onChange={(e) => setSubwayCheese(Number(e.target.value))}
                        className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                      >
                        <option value={0}>No Cheese (0 kcal)</option>
                        <option value={40}>American Cheese (40 kcal)</option>
                        <option value={50}>Provolone (50 kcal)</option>
                        <option value={60}>Pepper Jack (60 kcal)</option>
                      </select>
                    </div>
                    <div className="bg-[#faf9f7] dark:bg-[#141210] p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b]">
                      <label htmlFor="subway-sauce-select" className="block font-medium text-[#57534e] dark:text-[#b5afa6] mb-2">Sauce / dressing</label>
                      <select
                        id="subway-sauce-select"
                        value={subwaySauce}
                        onChange={(e) => setSubwaySauce(Number(e.target.value))}
                        className="w-full h-11 px-3 bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] rounded-[8px] text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] focus:outline-none focus:border-[#1c1917] dark:focus:border-[#f5f3ef]"
                      >
                        <option value={5}>Yellow Mustard (5 kcal)</option>
                        <option value={30}>Sweet Onion Teriyaki (30 kcal)</option>
                        <option value={60}>Honey Mustard (60 kcal)</option>
                        <option value={100}>Regular Mayonnaise (100 kcal)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Result Card & Download */}
        <div className="lg:col-span-5 relative bg-[#faf9f7] dark:bg-[#141210] rounded-2xl p-6 border border-[#e5e1d8] dark:border-[#332f2b] flex flex-col justify-between space-y-6">
          {/* Floating Print / PDF Summary Action Button */}
          <button
            type="button"
            onClick={downloadResult}
            data-testid="floating-print-pdf-btn"
            aria-label="Print and download PDF summary"
            title="Generate and download a clean PDF summary of your results"
            className="absolute top-4 right-4 z-10 min-h-[36px] px-3 py-1.5 rounded-[8px] bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] transition-colors duration-150 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            {pdfDownloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span>{t.savedPdf}</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span>{t.printPdf}</span>
              </>
            )}
          </button>

          {/* Main Visual Stat */}
          {mode === 'adult' && (
            <div>
              <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6] block mb-2 pr-28">
                {t.resultHeadingAdult}
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className={`text-4xl sm:text-5xl font-medium tracking-tight tabular-nums ${isLoss ? 'text-[#c2410c] dark:text-[#ea580c]' : 'text-[#1c1917] dark:text-[#f5f3ef]'}`}>
                  {isLoss ? `-${adultPct}%` : `${adultPct}%`}
                </span>
                <span className="text-sm font-normal text-[#57534e] dark:text-[#b5afa6] tabular-nums">
                  ({isLoss ? `-${adultLost.toFixed(1)}` : `+${Math.abs(adultLost).toFixed(1)}`} {unit})
                </span>
              </div>

              {/* UK / Imperial Stone & Pounds Equivalent */}
              <div className="mt-2 inline-flex flex-wrap items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] text-xs font-normal text-[#57534e] dark:text-[#b5afa6] tabular-nums">
                <span>{p.stoneEquivalentLabel}</span>
                <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                  {isLoss ? '-' : '+'}{lostStoneAndLbs.stones} st {lostStoneAndLbs.pounds} lbs
                </span>
                <span className="text-[#a8a29e]">•</span>
                <span>
                  {currentStoneAndLbs.stones} st {currentStoneAndLbs.pounds} lbs
                </span>
              </div>

              {/* Clinical Sub-Focus Card (Fasting/OMAD, Bariatric %EWL, GLP-1 Trajectory, or Postpartum) */}
              {activeFocus === 'fasting' && (
                <div className="mt-4 p-4 rounded-xl bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] text-xs text-[#1c1917] dark:text-[#f5f3ef] space-y-2">
                  <div className="flex items-center justify-between font-medium">
                    <span>{p.fastingLabel}</span>
                    <span className="text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                      -{fastingTotalDrop} {unit} total scale
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#edeae3] dark:border-[#2a2623] tabular-nums">
                    <div className="bg-[#faf9f7] dark:bg-[#141210] p-2.5 rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b]">
                      <span className="block text-[11px] text-[#57534e] dark:text-[#b5afa6] font-normal">True fat loss (kept)</span>
                      <span className="text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                        -{fastingTrueFatLoss} {unit} (-{fastingNetPct}%)
                      </span>
                    </div>
                    <div className="bg-[#faf9f7] dark:bg-[#141210] p-2.5 rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b]">
                      <span className="block text-[11px] text-[#57534e] dark:text-[#b5afa6] font-normal">Glycogen and water</span>
                      <span className="text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">
                        -{fastingWaterLoss} {unit} (refeed)
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
                    {p.fastingDesc}
                  </p>
                </div>
              )}

              {activeFocus === 'bariatric' && (
                <div className="mt-4 p-4 rounded-xl bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] text-xs text-[#1c1917] dark:text-[#f5f3ef] space-y-2">
                  <div className="flex items-center justify-between font-medium">
                    <span>{p.ewlLabel}</span>
                    <span className="text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">{excessWeightLostPct}% EWL</span>
                  </div>
                  {/* Month-by-Month Post-Op Timeline Table (1M, 3M, 6M, 12M, 18M) */}
                  <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-[#edeae3] dark:border-[#2a2623] text-center tabular-nums">
                    {[
                      { m: '1M', ewl: activeBariatric.ewlMonths[0] },
                      { m: '3M', ewl: activeBariatric.ewlMonths[1] },
                      { m: '6M', ewl: activeBariatric.ewlMonths[2] },
                      { m: '12M', ewl: activeBariatric.ewlMonths[3] },
                      { m: '18M', ewl: activeBariatric.ewlMonths[4] }
                    ].map((pt) => {
                      const projWeight = Math.max(gWeight || sWeight * 0.65, +(sWeight - (excessWeightTotal * pt.ewl) / 100).toFixed(0));
                      return (
                        <div key={pt.m} className="bg-[#faf9f7] dark:bg-[#141210] p-1.5 rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b]">
                          <span className="block text-[10px] font-normal text-[#57534e] dark:text-[#b5afa6]">{pt.m} ({pt.ewl}%)</span>
                          <span className="text-[11px] font-medium text-[#1c1917] dark:text-[#f5f3ef]">{projWeight} {unit}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
                    {p.ewlDesc((gWeight || sWeight * 0.65).toFixed(0), unit)}
                  </p>
                </div>
              )}

              {activeFocus === 'glp1' && (
                <div className="mt-4 p-4 rounded-xl bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] text-xs text-[#1c1917] dark:text-[#f5f3ef] space-y-2">
                  <div className="flex items-center justify-between font-medium">
                    <span>{activeGlp1.name}</span>
                    <span className="text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">
                      {(sWeight * (1 - activeGlp1.meanTbwlPct / 100)).toFixed(1)} {unit} (-{activeGlp1.meanTbwlPct}%)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-[8px] bg-[#faf9f7] dark:bg-[#141210] border border-[#e5e1d8] dark:border-[#332f2b] text-[11px]">
                    <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef] block mb-0.5">
                      {activeGlp1.trialName} escalation:
                    </span>
                    <span className="text-[#57534e] dark:text-[#b5afa6]">{activeGlp1.titrationSchedule}</span>
                  </div>
                  <p className="text-[11px] text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
                    <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef]">Clinical safety note:</span> FDA-approved GLP-1/GIP therapies are dispensed in calibrated pre-filled pens. Avoid unapproved research peptides or DIY syringe reconstitution.
                  </p>
                </div>
              )}

              {activeFocus === 'postpartum' && (
                <div className="mt-4 p-4 rounded-xl bg-[#ffffff] dark:bg-[#1c1917] border border-[#e5e1d8] dark:border-[#332f2b] text-xs text-[#1c1917] dark:text-[#f5f3ef] space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span>{p.postpartumLabel}</span>
                    <span className="text-[#1c1917] dark:text-[#f5f3ef] tabular-nums">{postpartumSafeDailyKcal} kcal/day safe goal</span>
                  </div>
                  <p className="text-[11px] text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
                    Includes <span className="font-medium text-[#1c1917] dark:text-[#f5f3ef]">+{activeLactation.kcalAdder} kcal/day</span> lactation synthesis allowance ({p.postpartumPace}) to protect maternal milk supply.
                  </p>
                </div>
              )}

              {/* Progress to Goal */}
              {gWeight > 0 && sWeight !== gWeight && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-normal text-[#57534e] dark:text-[#b5afa6] tabular-nums">
                    <span>{t.goalLabel}: {gWeight} {unit}</span>
                    <span className="text-[#1c1917] dark:text-[#f5f3ef] font-medium">
                      {Math.max(0, Math.min(100, +(((sWeight - cWeight) / (sWeight - gWeight)) * 100).toFixed(0)))}% {t.ofGoalLabel}
                    </span>
                  </div>
                  <div className="w-full bg-[#e5e1d8] dark:bg-[#332f2b] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#1c1917] dark:bg-[#f5f3ef] h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${Math.min(100, Math.max(0, ((sWeight - cWeight) / (sWeight - gWeight)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Scale-Tick Clinical Milestone Rule + Plain Summary */}
              <div className="mt-4 pt-4 border-t border-[#e5e1d8] dark:border-[#332f2b] space-y-3">
                <ScaleMilestoneRule
                  percentLoss={isLoss ? adultPct : 0}
                  maxPercent={15}
                  label="Clinical milestones"
                  statusText={isLoss ? `${adultPct}% lost` : '0%'}
                  compact
                />
                <div className="text-xs text-[#1c1917] dark:text-[#f5f3ef] space-y-1">
                  <p className="font-medium leading-snug">
                    {locale === 'en'
                      ? adultPct >= 15
                        ? '15% weight loss — a clinically significant milestone'
                        : adultPct >= 10
                        ? '10% weight loss — a clinically significant milestone'
                        : adultPct >= 5
                        ? '5% weight loss — a clinically significant milestone'
                        : 'Next clinical milestone: 5% body weight reduction'
                      : (adultPct >= 15
                          ? t.milestone15
                          : adultPct >= 10
                          ? t.milestone10
                          : adultPct >= 5
                          ? t.milestone5
                          : t.milestoneNext5
                        ).replace(/!/g, '')}
                  </p>
                  <p className="text-[11px] text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
                    {t.milestoneDescReached}
                  </p>
                </div>
              </div>
            </div>
          )}

          {mode === 'newborn' && (
            <div>
              <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6] block mb-2 pr-28">
                {t.resultHeadingNewborn}
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-medium tracking-tight tabular-nums text-[#c2410c] dark:text-[#ea580c]">
                  {newbornLossPct}%
                </span>
                <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6] tabular-nums">
                  (-{newbornGramsLost} g, {babyHoursOld} {t.hoursOldSuffix})
                </span>
              </div>

              {/* AAP Guideline Callout */}
              <div className="mt-4 p-4 rounded-xl border border-[#e5e1d8] dark:border-[#332f2b] bg-[#ffffff] dark:bg-[#1c1917] text-xs text-[#1c1917] dark:text-[#f5f3ef]">
                <div className="flex items-center gap-2 font-medium mb-1">
                  {newbornLossPct > 10 ? (
                    <AlertTriangle className="w-4 h-4 text-[#1c1917] dark:text-[#f5f3ef] shrink-0" strokeWidth={1.75} />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#1c1917] dark:text-[#f5f3ef] shrink-0" strokeWidth={1.75} />
                  )}
                  <span>
                    {newbornLossPct > 10
                      ? t.aapOver10Title
                      : newbornLossPct >= 7
                      ? t.aap7To10Title
                      : t.aapUnder7Title}
                  </span>
                </div>
                <p className="text-[11px] text-[#57534e] dark:text-[#b5afa6] leading-relaxed">
                  {newbornLossPct > 10
                    ? t.aapOver10Desc
                    : newbornLossPct >= 7
                    ? t.aap7To10Desc
                    : t.aapUnder7Desc}
                </p>
              </div>
            </div>
          )}

          {mode === 'bmr' && (
            <div>
              <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6] block mb-3 pr-28">
                {t.resultHeadingBmr}
              </span>
              <div className="space-y-2.5 tabular-nums">
                <div className="flex justify-between items-baseline border-b border-[#e5e1d8] dark:border-[#332f2b] pb-2">
                  <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6]">{t.restingBurnLabel}</span>
                  <span className="text-xl font-medium text-[#c2410c] dark:text-[#ea580c]">{calculatedBmr} <span className="text-xs font-normal text-[#78716c] dark:text-[#8c857d]">kcal/day</span></span>
                </div>
                <div className="flex justify-between items-baseline border-b border-[#e5e1d8] dark:border-[#332f2b] pb-2">
                  <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6]">{t.maintenanceLabel}</span>
                  <span className="text-xl font-medium text-[#1c1917] dark:text-[#f5f3ef]">{calculatedTdee} <span className="text-xs font-normal text-[#78716c] dark:text-[#8c857d]">kcal/day</span></span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-normal text-[#57534e] dark:text-[#b5afa6]">{t.steadyLossLabel}</span>
                  <span className="text-xl font-medium text-[#1c1917] dark:text-[#f5f3ef]">{Math.max(1200, calculatedTdee - 500)} <span className="text-xs font-normal text-[#78716c] dark:text-[#8c857d]">kcal/day</span></span>
                </div>

                {/* Losertown-Style 12-Week Weight & Date Forecast Table */}
                <div className="mt-4 pt-3 border-t border-[#e5e1d8] dark:border-[#332f2b]">
                  <div className="flex items-center justify-between text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef] mb-2">
                    <span>12-week weight forecast ({intakeVal} kcal/d)</span>
                    <span className="text-[#57534e] dark:text-[#b5afa6]">
                      {weeklyWeightChange >= 0 ? `-${weeklyWeightChange}` : `+${Math.abs(weeklyWeightChange)}`} {unit}/wk
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                    {[2, 4, 8, 12].map((wk) => {
                      const projW = Math.max(40, +(cWeight - weeklyWeightChange * wk).toFixed(1));
                      const pctChange = cWeight > 0 ? +(((cWeight - projW) / cWeight) * 100).toFixed(1) : 0;
                      return (
                        <div key={wk} className="bg-[#ffffff] dark:bg-[#1c1917] p-2 rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b]">
                          <span className="block text-[10px] font-normal text-[#78716c] dark:text-[#8c857d]">Wk {wk}</span>
                          <span className="block font-medium text-[#1c1917] dark:text-[#f5f3ef]">{projW} {unit}</span>
                          <span className="block text-[10px] font-normal text-[#57534e] dark:text-[#b5afa6]">-{pctChange}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Keto Live Macro Grams Split (70% Fat, 25% Protein, 5% Carbs) based on user TDEE */}
                {isKeto && (
                  <div className="mt-4 pt-3 border-t border-[#e5e1d8] dark:border-[#332f2b]">
                    <div className="flex items-center justify-between text-xs font-medium text-[#1c1917] dark:text-[#f5f3ef] mb-2">
                      <span>Keto macro split ({calculatedTdee} kcal TDEE)</span>
                      <span className="text-[#57534e] dark:text-[#b5afa6]">70 / 25 / 5%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="bg-[#ffffff] dark:bg-[#1c1917] p-2.5 rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b]">
                        <span className="block text-[10px] font-normal text-[#57534e] dark:text-[#b5afa6]">Fat (70%)</span>
                        <span className="block text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">{ketoFatG}g</span>
                        <span className="block text-[10px] text-[#78716c] dark:text-[#8c857d]">9 kcal/g</span>
                      </div>
                      <div className="bg-[#ffffff] dark:bg-[#1c1917] p-2.5 rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b]">
                        <span className="block text-[10px] font-normal text-[#57534e] dark:text-[#b5afa6]">Protein (25%)</span>
                        <span className="block text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">{ketoProteinG}g</span>
                        <span className="block text-[10px] text-[#78716c] dark:text-[#8c857d]">4 kcal/g</span>
                      </div>
                      <div className="bg-[#ffffff] dark:bg-[#1c1917] p-2.5 rounded-[8px] border border-[#e5e1d8] dark:border-[#332f2b]">
                        <span className="block text-[10px] font-normal text-[#57534e] dark:text-[#b5afa6]">Net carbs (5%)</span>
                        <span className="block text-sm font-medium text-[#1c1917] dark:text-[#f5f3ef]">{ketoCarbsG}g</span>
                        <span className="block text-[10px] text-[#78716c] dark:text-[#8c857d]">4 kcal/g</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'subway' && (
            <div>
              <span className="text-xs font-medium text-[#57534e] dark:text-[#b5afa6] block mb-2 pr-28">
                {activeBrand === 'five-guys'
                  ? 'Five Guys meal total'
                  : activeBrand === 'mcdonalds'
                  ? p.mcdResultHeading
                  : t.resultHeadingSubway}
              </span>
              <div className="text-4xl sm:text-5xl font-medium text-[#c2410c] dark:text-[#ea580c] tabular-nums">
                {activeRestaurantCalories} <span className="text-base font-normal text-[#57534e] dark:text-[#b5afa6]">kcal</span>
              </div>
              <p className="text-xs text-[#57534e] dark:text-[#b5afa6] mt-2 leading-relaxed tabular-nums">
                {activeBrand === 'five-guys'
                  ? `Represents ${Math.round((activeRestaurantCalories / Math.max(1200, calculatedTdee - 500)) * 100)}% of a ${Math.max(1200, calculatedTdee - 500)} kcal daily weight-loss budget. Fresh-cut fries cooked in pure peanut oil.`
                  : activeBrand === 'mcdonalds'
                  ? `Represents ${Math.round((activeRestaurantCalories / Math.max(1200, calculatedTdee - 500)) * 100)}% of a ${Math.max(1200, calculatedTdee - 500)} kcal daily weight-loss budget.`
                  : `Estimated for a ${subwaySize === 'footlong' ? '12-inch footlong' : '6-inch sub'} based on official restaurant nutrition guides.`}
              </p>
            </div>
          )}

          {/* Action Buttons: 48px Touch-Friendly Download PDF Report & Copy */}
          <div className="space-y-2.5 pt-4 border-t border-[#e5e1d8] dark:border-[#332f2b]">
            <button
              type="button"
              onClick={downloadResult}
              className="w-full min-h-[44px] py-2.5 px-4 bg-[#c2410c] hover:bg-[#9a3412] text-white font-medium text-sm rounded-[8px] flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
            >
              {pdfDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  <span>{t.pdfReportDownloaded}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  <span>{t.downloadReport}</span>
                  <span className="text-[11px] font-medium bg-white/15 px-1.5 py-0.5 rounded-[6px]">
                    PDF
                  </span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copySummary}
                className="min-h-[40px] py-2 px-3 bg-[#ffffff] dark:bg-[#1c1917] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] font-medium text-xs rounded-[8px] flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0" strokeWidth={1.75} />
                <span>{copied ? t.copied : t.copySummary}</span>
              </button>

              <button
                type="button"
                onClick={triggerCelebration}
                className="min-h-[40px] py-2 px-3 bg-[#ffffff] dark:bg-[#1c1917] hover:bg-[#f3f1ed] dark:hover:bg-[#25221f] border border-[#e5e1d8] dark:border-[#332f2b] text-[#1c1917] dark:text-[#f5f3ef] font-medium text-xs rounded-[8px] flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#57534e] dark:text-[#b5afa6] shrink-0" strokeWidth={1.75} />
                <span>Mark milestone</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
